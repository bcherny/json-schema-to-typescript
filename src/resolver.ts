import {
  $RefParser,
  FileInfo,
  ParserOptions as $RefOptions,
  Plugin,
  getJsonSchemaRefParserDefaultOptions,
} from '@apidevtools/json-schema-ref-parser'
import {prenormalizeDocument} from './prenormalizer'
import {JSONSchema} from './types/JSONSchema'
import {eachSchemaNode, log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    parse: prenormalizingParsers($refOptions.parse),
    dereference: {
      ...$refOptions.dereference,
      excludedPathMatcher: depthLimitedPathMatcher($refOptions.dereference),
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
function prenormalizingParsers(configured: $RefOptions['parse'] = {}): $RefOptions['parse'] {
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
        const tap: ParserCallback | undefined =
          callback && ((error, data) => callback(error, prenormalizeDocument(data)))
        const result: unknown = Reflect.apply(parse, this, [file, tap, ...rest])
        return isThenable(result) ? result.then(prenormalizeDocument) : prenormalizeDocument(result)
      },
    }
  }
  return parsers
}

type ParserCallback = (error: Error | null, data: any) => any

/**
 * The ref-parser cannot see one kind of cycle: a `$ref` with sibling keywords that points back at
 * its own container, when that container was itself entered through such a `$ref`. It merges the
 * target into a fresh object on every visit, so its "seen this object" checks never fire and it
 * nests without end (`#/a/b/b/b/…`) -- a stack overflow at best and, with a self-referencing `$ref`
 * nearby, hours of CPU first. So bound the nesting, as ref-parser releases from 15.3 on do
 * themselves (`dereference.maxDepth`, same default; real schemas stay under 100), from the one hook
 * that sees every path the crawl visits -- which otherwise stays the caller's.
 */
function depthLimitedPathMatcher(options: $RefOptions['dereference']): (pathFromRoot: string) => boolean {
  const {excludedPathMatcher, maxDepth = 500} = (options ?? {}) as {
    excludedPathMatcher?: (path: string) => boolean
    maxDepth?: number
  }
  const shortEnough = 2 * maxDepth // "#" and then at least "/x" per level: most paths stop here
  return path => {
    const levels = path.length > shortEnough ? path.split('/') : undefined
    if (levels && levels.length - 1 > maxDepth) {
      throw new ReferenceError(
        `$ref nesting goes deeper than ${maxDepth} levels at ${levels.slice(0, 7).join('/')}/… -- almost ` +
          'certainly a "$ref" with sibling keywords that leads back to its own parent, a cycle the ref ' +
          'resolver cannot detect. (If the schema really nests this deep, raise $refOptions.dereference.maxDepth.)',
      )
    }
    return excludedPathMatcher?.(path) ?? false
  }
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
