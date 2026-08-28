import {
  $RefParser,
  FileInfo,
  JSONParserErrorGroup,
  ParserOptions as $RefOptions,
  Plugin,
  ResolverOptions,
  dereferenceInternal,
  getJsonSchemaRefParserDefaultOptions,
  jsonSchemaParserNormalizeArgs,
} from '@apidevtools/json-schema-ref-parser'
import {isObjectLike, isPlainObject} from 'lodash'
import {prenormalizeDocument} from './prenormalizer'
import {DefinitionKey, JSONSchema, SchemaSource, Source} from './types/JSONSchema'
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
  const externalDocuments = new Set<JSONSchema>()
  const onDereference = ($ref: string, schema: JSONSchema) => {
    // The target of a $ref need not be an object: it can be a boolean schema (`true`/`false`),
    // or -- for a pointer into a keyword's value -- any JSON value. Only objects can be WeakMap
    // keys, and only objects are named after the path they were referenced by.
    if (schema !== null && typeof schema === 'object') {
      dereferencedPaths.set(schema, $ref)
      if (isWholeDocumentRef($ref)) {
        externalDocuments.add(schema)
      }
    }
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
    const parser = new $RefParser()
    const documents = new IdScopeMask()
    const {path, options} = jsonSchemaParserNormalizeArgs<JSONSchema, $RefOptions>([
      set?.file ?? cwd,
      schema,
      {
        ...$refOptions,
        mutateInputSchema: true, // `schema` is this module's own copy already
        resolve,
        parse: prenormalizingParsers($refOptions.parse, (document, file) => documents.hide(prepare(document, file))),
        dereference: {...$refOptions.dereference, onDereference},
      },
    ])
    try {
      // = parser.dereference(path, schema, options), with the documents' `$id`s out of the way while it
      // reads them in (which is when it decides what their `$ref`s are relative to) and back before it
      // inlines anything (so every copy it makes of a `$ref` target is whole)
      try {
        await parser.resolve(path, documents.hide(schema), options)
      } finally {
        documents.restore()
      }
      dereferenceInternal(parser, options)
      if (JSONParserErrorGroup.getParserErrors(parser).length) {
        throw new JSONParserErrorGroup(parser) // what `continueOnError: true` collected instead of throwing
      }
    } catch (error) {
      throw tooDeepFromRefParser(error) ?? error
    }
    dereferencedSchema = parser.schema as JSONSchema
    tagExternalDefinitions(externalDocuments, dereferencedSchema)
  }
  return {dereferencedPaths, dereferencedSchema: resolveNamedAnchors(dereferencedSchema)}
}

/*
 * A `$ref` here resolves against the file it is written in, and `$id`/`id` name types. The ref-parser
 * (from 16 on) instead treats a document that declares an `$id`, a draft `$schema` or `openapi: 3.1` as
 * a JSON Schema resource: its relative `$ref`s resolve against the `$id`, and a `#/…` pointer below a
 * nested `$id` against that sub-schema -- so a schema compiled from disk would fetch its neighbours
 * from wherever its `$id` points, and a pointer to the root's definitions from inside a named
 * sub-schema would no longer resolve. It decides that once per document, from the document's root, as
 * each is read in; so each root goes to it without those keywords and gets them back, in place, once
 * every document has been read.
 */

const ID_SCOPE_KEYWORDS = ['$schema', '$id', 'openapi']

export class IdScopeMask {
  private readonly restorers: Array<() => void> = []

  hide<T>(document: T): T {
    if (!isPlainObject(document)) {
      return document
    }
    const root = document as Record<string, unknown>
    const keys = Object.keys(root)
    const hidden = new Map<string, unknown>()
    for (const key of ID_SCOPE_KEYWORDS) {
      if (hasOwn(root, key)) {
        hidden.set(key, root[key])
        delete root[key]
      }
    }
    if (hidden.size) {
      this.restorers.push(() => {
        // back where they were, not behind the others: keyword order is visiting order downstream
        const current = {...root}
        for (const key of keys) {
          delete root[key]
          if (hidden.has(key)) {
            root[key] = hidden.get(key)
          } else if (hasOwn(current, key)) {
            root[key] = current[key]
          }
        }
      })
    }
    return document
  }

  restore(): void {
    this.restorers.forEach(restore => restore())
  }
}

/** `other.json`, `other.json#`, `http://x/y.json#/`: a $ref to a separate document as a whole */
function isWholeDocumentRef($ref: string): boolean {
  const hash = $ref.indexOf('#')
  const fragment = hash === -1 ? '' : $ref.slice(hash + 1)
  return hash !== 0 && (fragment === '' || fragment === '/')
}

/**
 * A schema brought in by a $ref to a separate document keeps its own `definitions`/`$defs`,
 * but once dereferenced into the referencing document that map sits somewhere below the
 * root, so its entries are not among the root's `$defs` that `normalize` names. Record on
 * each of them the key it is held under, so the parser names it as it would when compiling
 * that document on its own (see #143). Only documents referenced as a whole are considered; a definition reached
 * solely through `file.json#/definitions/X` pointers is named as before.
 */
function tagExternalDefinitions(documents: Set<JSONSchema>, rootSchema: JSONSchema) {
  const rootDefinitions = {...rootSchema.definitions, ...rootSchema.$defs}
  for (const document of documents) {
    if (!isPlainObject(document) || document === rootSchema) {
      continue
    }
    const {$defs, definitions} = document
    for (const [key, entry] of [...Object.entries($defs ?? {}), ...Object.entries(definitions ?? {})]) {
      // A name the document being compiled defines itself stays that definition's alone:
      // another file's entry under the same key is left unnamed (inlined, as before)
      // rather than taking the name or a numbered variant of it, depending on visit order.
      if (hasOwn(rootDefinitions, key) || !isPlainObject(entry) || hasOwn(entry, DefinitionKey)) {
        continue
      }
      // configurable: the root document's own `$defs` key takes precedence (see `normalize`)
      Object.defineProperty(entry, DefinitionKey, {configurable: true, enumerable: false, value: key})
    }
  }
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
    if (!isPlainObject(node) || hasOwn(node, Source)) {
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
 * The ref-parser cannot see one kind of cycle: a `$ref` with sibling keywords that points back at
 * its own container, when that container was itself entered through such a `$ref`. It merges the
 * target into a fresh object on every visit, so its "seen this object" checks never fire and it
 * nests without end (`#/a/b/b/b/…`). What stops it is the bound it keeps on nesting depth
 * (`dereference.maxDepth`, 500 unless the caller says otherwise; real schemas stay under 100) --
 * reported here with the likelier cause spelled out, and kept by `dereferenceInDocument`, which
 * copies the ref-parser's bookkeeping and so its blind spot, by the same count.
 */

const DEFAULT_MAX_DEPTH = 500

/**
 * The ref-parser's "Maximum dereference depth (N) exceeded at #/…" (nesting, counted from the root) with the
 * likelier cause spelled out; not its namesake for a chain of N `$ref`s, which names a file instead
 */
function tooDeepFromRefParser(error: unknown): ReferenceError | undefined {
  const match =
    error instanceof RangeError && /^Maximum dereference depth \((\d+)\) exceeded at (#.*?)\. This /.exec(error.message)
  return match ? tooDeep(Number(match[1]), match[2]) : undefined
}

function tooDeep(maxDepth: number, path: string): ReferenceError {
  const levels = path.split('/') // root (`#`) first
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
    if (!isObjectWithoutRef(node) || !hasOwn(node, key)) {
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
        throw tooDeep(DEFAULT_MAX_DEPTH, `#/${trail.join('/')}`)
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
    if (cached && (!extended || cached.circular)) {
      return cached // (sic) siblings and all, when the target turned out circular
    }
    const target = targets.get(ref.$ref)!
    const value = extended ? extend(ref, target as Record<string, unknown>) : target
    const resolution = {value, circular: parents.has(target) || crawl(value)}
    if (!extended) {
      cache.set(ref.$ref, resolution)
    }
    return resolution
  }

  crawl(root)
}

/**
 * A new object with the `$ref`'s sibling keywords, then the target's keywords they don't restate -- and
 * where both give an object for the same keyword, the two merged, the siblings' members winning
 * ($RefParser's `dereference.mergeKeys`, on by default)
 */
function extend(ref: Ref, target: {[key: string]: unknown}): object {
  const merged: Record<string, unknown> = {}
  for (const key of Object.keys(ref)) {
    if (key !== '$ref') {
      merged[key] = ref[key]
    }
  }
  for (const key of Object.keys(target)) {
    if (!hasOwn(merged, key)) {
      merged[key] = target[key]
    } else if (isObjectLike(target[key]) && isObjectLike(merged[key])) {
      merged[key] = deepMerge(target[key], merged[key] as object)
    }
  }
  return merged
}

/** $RefParser's: `source`'s members laid over a copy of `target`'s, recursively; arrays are copied, never merged */
function deepMerge(target: unknown, source: object): object {
  if (!isObjectLike(target)) {
    return source
  }
  if (Array.isArray(source)) {
    return [...source]
  }
  const base = target as Record<string, unknown>
  const merged = {...base}
  for (const key of Object.keys(source)) {
    const value = (source as typeof merged)[key]
    merged[key] = Array.isArray(value)
      ? [...value]
      : isObjectLike(value)
        ? deepMerge(hasOwn(base, key) ? base[key] : undefined, value as object)
        : value
  }
  return merged
}

function hasOwn(object: unknown, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(object, key)
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
