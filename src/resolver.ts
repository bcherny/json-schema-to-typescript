import {
  $RefParser,
  FileInfo,
  ParserOptions as $RefOptions,
  Plugin,
  getJsonSchemaRefParserDefaultOptions,
} from '@apidevtools/json-schema-ref-parser'
import {prenormalizeDocument} from './prenormalizer'
import {JSONSchema} from './types/JSONSchema'
import {isObjectLike, isPlainObject} from 'lodash'
import {eachSchemaNode, log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const onDereference = ($ref: string, schema: JSONSchema) => {
    dereferencedPaths.set(schema, $ref)
  }
  // `resolve` and `parse` settings only concern other files; any other option can change what $RefParser does
  const optionsConcernOtherFiles = Object.keys($refOptions).every(_ => _ === 'resolve' || _ === 'parse')
  const targets = optionsConcernOtherFiles ? inDocumentTargets(schema) : undefined
  let dereferencedSchema = schema
  if (targets) {
    dereferenceInDocument(schema, targets, onDereference)
  } else {
    dereferencedSchema = (await new $RefParser().dereference(cwd, schema, {
      ...$refOptions,
      parse: prenormalizingParsers($refOptions.parse),
      dereference: {
        ...$refOptions.dereference,
        excludedPathMatcher: depthLimitedPathMatcher($refOptions.dereference),
        onDereference,
      },
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

/*
 * The ref-parser cannot see one kind of cycle: a `$ref` with sibling keywords that points back at
 * its own container, when that container was itself entered through such a `$ref`. It merges the
 * target into a fresh object on every visit, so its "seen this object" checks never fire and it
 * nests without end (`#/a/b/b/b/…`) -- a stack overflow at best and, with a self-referencing `$ref`
 * nearby, hours of CPU first. So bound the nesting, as ref-parser releases from 15.3 on do
 * themselves (`dereference.maxDepth`, same default; real schemas stay under 100): in $RefParser from
 * the one hook that sees every path the crawl visits -- which otherwise stays the caller's -- and in
 * `dereferenceInDocument`, which copies its bookkeeping and so its blind spot, by the same count.
 */

const DEFAULT_MAX_DEPTH = 500

function depthLimitedPathMatcher(options: $RefOptions['dereference']): (pathFromRoot: string) => boolean {
  const {excludedPathMatcher, maxDepth: configured} = (options ?? {}) as {
    excludedPathMatcher?: (path: string) => boolean
    maxDepth?: number | null
  }
  const maxDepth = configured ?? DEFAULT_MAX_DEPTH // read as ref-parser 15.3+ reads it: null, like undefined, means the default
  const shortEnough = 2 * maxDepth // "#" then at least "/x" per level: most paths stop here (empty keys fire late, not never)
  return path => {
    const levels = path.length > shortEnough ? path.split('/') : undefined
    if (levels && levels.length - 1 > maxDepth) {
      throw tooDeep(maxDepth, levels)
    }
    return excludedPathMatcher?.(path) ?? false
  }
}

/** `levels`: the runaway path split at `/`, root (`#`) first */
function tooDeep(maxDepth: number, levels: string[]): ReferenceError {
  return new ReferenceError(
    `$ref nesting goes deeper than ${maxDepth} levels at ${levels.slice(0, 7).join('/')}${levels.length > 7 ? '/…' : ''} -- ` +
      'either a "$ref" with sibling keywords that leads back to its own parent (a cycle the ref resolver ' +
      'cannot detect), or a schema that really nests this deep: then raise $refOptions.dereference.maxDepth.',
  )
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
  const trail: string[] = [] // the keys from the root to here ($RefParser's `pathFromRoot`)

  /** Dereferences everything under `node`; true if something in there refers back to an ancestor */
  function crawl(node: any): boolean {
    if (!isObjectLike(node) || visited.has(node)) {
      return false
    }
    visited.add(node)
    parents.add(node)
    let circular = false
    for (const key of Object.keys(node)) {
      if (trail.push(key) > DEFAULT_MAX_DEPTH) {
        throw tooDeep(DEFAULT_MAX_DEPTH, ['#', ...trail])
      }
      const value = node[key]
      if (isRef(value)) {
        const resolution = resolve(value)
        node[key] = resolution.value
        onDereference(value.$ref, resolution.value)
        circular = resolution.circular || circular
      } else {
        circular = parents.has(value) || crawl(value) || circular
      }
      trail.pop()
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
