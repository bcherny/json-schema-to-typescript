import {
  $RefParser,
  FileInfo,
  ParserOptions as $RefOptions,
  Plugin,
  ResolverOptions,
  getJsonSchemaRefParserDefaultOptions,
} from '@apidevtools/json-schema-ref-parser'
import {isObjectLike, isPlainObject} from 'lodash'
import {prenormalizeDocument} from './prenormalizer'
import {JSONSchema, SchemaSource, Source} from './types/JSONSchema'
import {eachSchemaNode, log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

/**
 * A set of schema files being compiled together (`compileFiles`), as seen from one of them:
 * which file this schema is, and the contents of every file of the set, read once up front.
 */
export interface SchemaSet {
  /** The absolute path this schema was read from */
  file: string
  /** Every file of the set by absolute path, this one included: its contents as read from disk */
  files: ReadonlyMap<string, string>
}

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
  /**
   * Only when compiling a set of files together (`compileFiles`). The schema is then
   * registered with the ref-parser under its own path rather than under `cwd` -- so a `$ref`
   * in another file that leads back to this one resolves to this very object instead of a
   * second copy -- the other files of the set are served from memory rather than read again,
   * and every node of every document gets stamped with the file and JSON Pointer it was read
   * from (its `Source`) before any `$ref` is inlined.
   */
  set?: SchemaSet,
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const onDereference = ($ref: string, schema: JSONSchema) => {
    dereferencedPaths.set(schema, $ref)
  }
  let prepare: Prepare = prenormalizeDocument
  let resolve = $refOptions.resolve
  if (set) {
    stampSource(schema, fileKey(set.file))
    prepare = (document, file) => stampSource(prenormalizeDocument(document), fileKey(file.url))
    const files = new Map([...set.files].map(([file, contents]) => [fileKey(file), contents]))
    // Serves the files of the set from memory, ahead of the ref-parser's own file resolver
    const inMemory: ResolverOptions = {
      order: 1,
      canRead: ({url}) => files.has(fileKey(url)),
      read: ({url}) => files.get(fileKey(url))!,
    }
    resolve = {...resolve, set: inMemory}
  }
  // `resolve` and `parse` settings only concern other files; any other option can change what
  // $RefParser does. A member of a file set goes to $RefParser too: it is registered there under
  // its own path, for the other members' `$ref`s to find.
  const optionsConcernOtherFiles = Object.keys($refOptions).every(_ => _ === 'resolve' || _ === 'parse')
  const targets = optionsConcernOtherFiles && !set ? inDocumentTargets(schema) : undefined
  let dereferencedSchema = schema
  if (targets) {
    dereferenceInDocument(schema, targets, onDereference)
  } else {
    dereferencedSchema = (await new $RefParser().dereference(set?.file ?? cwd, schema, {
      ...$refOptions,
      resolve,
      parse: prenormalizingParsers($refOptions.parse, prepare),
      dereference: {...$refOptions.dereference, onDereference},
    })) as JSONSchema
  }
  return {dereferencedPaths, dereferencedSchema: resolveNamedAnchors(dereferencedSchema)}
}

/**
 * Returns the parsers in effect (the ref-parser's defaults overlaid with the caller's
 * `$refOptions.parse`) with each `parse` wrapped, so that every file loaded through a `$ref`
 * gets the same pre-dereference rewrites as the schema being compiled, before its own
 * `$ref`s are resolved.
 */
function prenormalizingParsers(configured: $RefOptions['parse'] = {}, prepare: Prepare): $RefOptions['parse'] {
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
/** What is done to each parsed document before the ref-parser gets it back */
type Prepare = <T>(document: T, file: FileInfo) => T

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

/*
 * Most schemas reference nothing outside themselves: every `$ref` is a JSON Pointer into the same
 * document. For those, $RefParser's generality (URLs and files, parsers, pointers that lead through
 * other `$ref`s) is all cost -- about a fifth of compile time on a large schema, most of it URL and
 * pointer string handling. `dereferenceInDocument` does what $RefParser does for that case alone, with
 * the same result; `inDocumentTargets` decides, conservatively, whether a document is that case, and
 * everything else goes to $RefParser. (test/resolver.test.ts compares the two.)
 */

type Ref = {$ref: string; [sibling: string]: unknown}

/** What $RefParser treats as a reference (anything else with a `$ref` key is an ordinary object) */
function isRef(value: unknown): value is Ref {
  return isObjectLike(value) && typeof (value as Ref).$ref === 'string' && (value as Ref).$ref !== ''
}

/**
 * `#/...` made of characters that neither URL resolution nor pointer decoding would rewrite (so no
 * `%`, `\`, whitespace, quotes or non-ASCII: pointers with those are left to $RefParser)
 */
const PLAIN_POINTER = /^#\/(?:(?!["%<>\\`])[\x21-\x7e])*$/

/**
 * The target of every distinct `$ref` in the document, provided all of them are plain pointers to an
 * object in the document that resolve without meeting another `$ref` on the way or at the end (the
 * cases where $RefParser does more than look up a path). Undefined if any is anything else: a URL
 * or file, `#`, a named anchor, a pointer through or onto a `$ref`, a missing target.
 */
export function inDocumentTargets(root: JSONSchema): Map<string, object> | undefined {
  if (!isPlainObject(root) || '$ref' in root) {
    return undefined
  }
  const targets = new Map<string, object>()
  const visited = new Set<unknown>()
  /** False as soon as it meets a `$ref` that rules the document out */
  function scan(node: any): boolean {
    if (!isObjectLike(node) || visited.has(node)) {
      return true
    }
    if (ArrayBuffer.isView(node)) {
      return false // binary data, which $RefParser doesn't look into: rare, leave the document to it
    }
    visited.add(node)
    if (isRef(node) && !targets.has(node.$ref)) {
      const target = PLAIN_POINTER.test(node.$ref) && pointerTarget(root, node.$ref)
      if (!target) {
        return false
      }
      targets.set(node.$ref, target)
    }
    return Object.values(node).every(scan) // instance data too, like $RefParser
  }
  return scan(root) ? targets : undefined
}

function isObjectWithoutRef(value: unknown): boolean {
  return isObjectLike(value) && !('$ref' in (value as object))
}

function pointerTarget(root: JSONSchema, pointer: string): object | undefined {
  let node: any = root
  for (const token of pointer.slice(2).split('/')) {
    const key = token.replace(/~1/g, '/').replace(/~0/g, '~')
    if (!isObjectWithoutRef(node) || !Object.prototype.hasOwnProperty.call(node, key)) {
      return undefined
    }
    node = node[key]
  }
  return isObjectWithoutRef(node) ? node : undefined
}

/**
 * Replaces every `{$ref}` in the document with its target (from `targets`), in place, as $RefParser's
 * dereference step would: a `$ref` with sibling keywords becomes a new object, the siblings laid over the
 * target; each replacement is reported to `onDereference`. The bookkeeping is $RefParser's too -- which
 * objects are done, which are on the path from the root, a cache per pointer that is bypassed while its
 * target is on that path -- because it decides which objects get shared and which copied.
 */
export function dereferenceInDocument(
  root: JSONSchema,
  targets: Map<string, object>,
  onDereference: ($ref: string, schema: JSONSchema) => void,
): void {
  type Resolution = {value: object; circular: boolean}
  const visited = new Set<unknown>()
  const parents = new Set<unknown>() // the objects on the path from the root to here
  const cache = new Map<string, Resolution>()

  /** Dereferences everything under `node`; true if something in there refers back to an ancestor */
  function crawl(node: any): boolean {
    if (!isObjectLike(node) || visited.has(node)) {
      return false
    }
    visited.add(node)
    parents.add(node)
    let circular = false
    for (const key of Object.keys(node)) {
      const value = node[key]
      if (isRef(value)) {
        const resolution = resolve(value)
        node[key] = resolution.value
        onDereference(value.$ref, resolution.value)
        circular = resolution.circular || circular
      } else {
        circular = parents.has(value) || crawl(value) || circular
      }
    }
    parents.delete(node)
    return circular
  }

  function resolve(ref: Ref): Resolution {
    const extended = Object.keys(ref).length > 1 // sibling keywords next to the `$ref`
    const cached = cache.get(ref.$ref)
    if (cached && !cached.circular) {
      return extended ? {value: overlay(cached.value, siblingsOf(ref)), circular: false} : cached // (sic)
    }
    const target = targets.get(ref.$ref)!
    const value = extended ? overlay(siblingsOf(ref), target) : target
    const resolution = {value, circular: parents.has(target) || crawl(value)}
    if (!extended) {
      cache.set(ref.$ref, resolution)
    }
    return resolution
  }

  crawl(root)
}

function siblingsOf(ref: Ref): object {
  const siblings: Partial<Ref> = {...ref}
  delete siblings.$ref
  return siblings
}

/** A new object with `first`'s keywords, then those of `second` that it lacks */
function overlay(first: object, second: object): object {
  const merged: Record<string, unknown> = {...first}
  for (const key of Object.keys(second)) {
    if (!(key in first)) {
      merged[key] = (second as typeof merged)[key]
    }
  }
  return merged
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
