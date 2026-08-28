import {
  $RefParser,
  FileInfo,
  ParserOptions as $RefOptions,
  Plugin,
  getJsonSchemaRefParserDefaultOptions,
} from '@apidevtools/json-schema-ref-parser'
import {isPlainObject} from 'lodash'
import {prenormalizeDocument} from './prenormalizer'
import {JSONSchema, SchemaSource, Source} from './types/JSONSchema'
import {eachSchemaNode, log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
  /**
   * The absolute path `schema` counts as read from, when compiling a set of files together
   * (`imports` mode). The schema is then registered with the ref-parser under that path
   * rather than under `cwd` -- so a `$ref` in another file that leads back to this one
   * resolves to this very object instead of a second copy read from disk -- and every node
   * of every document gets stamped with the file and JSON Pointer it was read from (its
   * `Source`), before any `$ref` is inlined.
   */
  sourceFile?: string,
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  if (sourceFile !== undefined) {
    stampSource(schema, fileKey(sourceFile))
  }
  const dereferencedSchema = (await parser.dereference(sourceFile ?? cwd, schema, {
    ...$refOptions,
    parse: prenormalizingParsers($refOptions.parse, sourceFile !== undefined),
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        dereferencedPaths.set(schema, $ref)
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema: resolveNamedAnchors(dereferencedSchema)}
}

/**
 * Returns the parsers in effect (the ref-parser's defaults overlaid with the caller's
 * `$refOptions.parse`) with each `parse` wrapped, so that every file loaded through a `$ref`
 * gets the same pre-dereference rewrites as the schema being compiled, before its own
 * `$ref`s are resolved.
 */
function prenormalizingParsers(configured: $RefOptions['parse'] = {}, stamp = false): $RefOptions['parse'] {
  const prepare = stamp
    ? (document: unknown, file: FileInfo) => stampSource(prenormalizeDocument(document), fileKey(file.url))
    : prenormalizeDocument
  const defaults = getJsonSchemaRefParserDefaultOptions().parse
  const parsers: $RefOptions['parse'] = {...defaults, ...configured}
  for (const [name, options] of Object.entries(parsers)) {
    const plugin = typeof options === 'object' ? {...(defaults[name] as Plugin | undefined), ...options} : undefined
    const parse = plugin?.parse
    if (typeof parse !== 'function') {
      continue // disabled (`false`), or left entirely to the defaults (`true`)
    }
    parsers[name] = {
      ...plugin,
      // A parser may return its result (or a promise of it), or hand it to `callback`. (Not
      // `parse.call`: the ref-parser passes a third argument the `Plugin` type leaves out.)
      parse(this: Plugin, file: FileInfo, callback?: ParserCallback, ...rest: unknown[]) {
        const tap: ParserCallback | undefined = callback && ((error, data) => callback(error, prepare(data, file)))
        const result: unknown = Reflect.apply(parse, this, [file, tap, ...rest])
        return isThenable(result) ? result.then(_ => prepare(_, file)) : prepare(result, file)
      },
    }
  }
  return parsers
}

type ParserCallback = (error: Error | null, data: any) => any

/**
 * One spelling per file, whichever way it was addressed: the ref-parser hands parsers an
 * encoded, forward-slashed path (or a URL), the CLI hands us a filesystem path.
 */
export function fileKey(urlOrPath: string): string {
  let key = urlOrPath.replace(/^file:\/\//i, '')
  try {
    key = decodeURI(key)
  } catch {}
  key = key.replace(/\\/g, '/')
  // Windows: '/C:/x' (from a file URL) and 'c:\x' both become 'C:/x'
  return key.replace(/^\/?([a-zA-Z]):\//, (_, drive: string) => `${drive.toUpperCase()}:/`)
}

/**
 * Stamps every object in a freshly parsed document with the file it came from and its
 * JSON Pointer within that file. Runs before dereferencing, so a node reached later
 * through an inlined `$ref` still says where it really lives. First stamp wins.
 */
function stampSource<T>(document: T, file: string): T {
  function go(node: unknown, pointer: string): void {
    if (Array.isArray(node)) {
      node.forEach((item, i) => go(item, `${pointer}/${i}`))
      return
    }
    if (!isPlainObject(node) || Object.prototype.hasOwnProperty.call(node, Source)) {
      return
    }
    const value: SchemaSource = {file, pointer}
    Object.defineProperty(node, Source, {enumerable: false, value, writable: false})
    for (const key of Object.keys(node as object)) {
      const child = (node as Record<string, unknown>)[key]
      if (child !== null && typeof child === 'object') {
        go(child, `${pointer}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`)
      }
    }
  }
  go(document, '')
  return document
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown>)?.then === 'function'
}

// A JSON Pointer fragment always starts with "#/" (or is exactly "#"); anything
// else after the "#" is a draft-07 style plain-name anchor.
function isAnchorRef($ref: string): boolean {
  return $ref.startsWith('#') && $ref !== '#' && !$ref.startsWith('#/')
}

/**
 * @apidevtools/json-schema-ref-parser only resolves `$ref`s that are JSON Pointers
 * (`#/...`). It has no support for draft-07 style named anchors, where a subschema
 * declares `$id: "#name"` and other parts of the document reference it via
 * `$ref: "#name"` -- those `$ref`s are left completely untouched by the parser
 * (@see https://github.com/APIDevTools/json-schema-ref-parser/issues/97), and would
 * otherwise crash the parser downstream.
 *
 * Find every such anchor in the already-dereferenced schema, and rewrite any matching
 * `$ref` in place to point at the same schema node -- the same substitution the
 * ref-parser itself performs for an ordinary (possibly circular) JSON Pointer `$ref`,
 * which the rest of the pipeline already knows how to handle. Returns the (possibly
 * new) root schema, in case the root itself was a named-anchor `$ref`.
 */
function resolveNamedAnchors(schema: JSONSchema): JSONSchema {
  const anchors = new Map<string, JSONSchema>()
  eachSchemaNode(schema, node => {
    if (typeof node.$id === 'string' && isAnchorRef(node.$id) && !anchors.has(node.$id)) {
      anchors.set(node.$id, node)
    }
  })
  if (!anchors.size) {
    return schema
  }

  // An anchor's own node can itself be an alias for another anchor
  // (`$id: "#b", $ref: "#a"`); follow those chains up front so every map entry
  // ends up pointing at a concrete (non-`$ref`) node.
  function resolveChain($ref: string, seen = new Set<string>()): JSONSchema {
    const node = anchors.get($ref)!
    if (typeof node.$ref === 'string' && anchors.has(node.$ref) && !seen.has($ref)) {
      return resolveChain(node.$ref, seen.add($ref))
    }
    return node
  }
  for (const name of anchors.keys()) {
    anchors.set(name, resolveChain(name))
  }

  let resolvedRoot = schema
  eachSchemaNode(schema, (node, replace) => {
    if (typeof node.$ref === 'string' && anchors.has(node.$ref)) {
      const target = anchors.get(node.$ref)!
      if (node === schema) {
        resolvedRoot = target
      }
      replace(target)
    }
  })
  return resolvedRoot
}
