import {deburr, isPlainObject, trim, upperFirst} from 'lodash'
import {basename, dirname, extname, normalize, sep, posix} from 'path'
import {
  Intersection,
  JSONSchema,
  JSONSchemaTypeName,
  LinkedJSONSchema,
  NormalizedJSONSchema,
  Parent,
} from './types/JSONSchema'
import {memoize} from './memoize'
import {JSONSchema4} from 'json-schema'
import {binaryTag, CORE_SCHEMA, load as loadYaml, mergeTag, omapTag, pairsTag, setTag, timestampTag} from 'js-yaml'
import type {Format} from 'cli-color'
import {
  ANNOTATION_KEYWORDS,
  CONTAINER_KEYWORDS,
  HASHED_SUBSCHEMA_KEYWORDS,
  JSON_DATA_KEYWORDS,
  NOT_SCANNED_FOR_DEFINITIONS,
  SUBSCHEMA_KEYWORDS,
} from './keywords'
import {createHash} from 'crypto'

// TODO: pull out into a separate package
export function Try<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}

function traverseObjectKeys(
  obj: Record<string, LinkedJSONSchema>,
  callback: (schema: LinkedJSONSchema, key: string | null) => void,
  processed: Set<LinkedJSONSchema>,
) {
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      traverse(obj[k], callback, processed, k)
    }
  })
}

function traverseArray(
  arr: LinkedJSONSchema[],
  callback: (schema: LinkedJSONSchema, key: string | null) => void,
  processed: Set<LinkedJSONSchema>,
) {
  arr.forEach((s, k) => traverse(s, callback, processed, k.toString()))
}

function traverseIntersection(
  schema: LinkedJSONSchema,
  callback: (schema: LinkedJSONSchema, key: string | null) => void,
  processed: Set<LinkedJSONSchema>,
) {
  if (typeof schema !== 'object' || !schema) {
    return
  }

  const r = schema as unknown as Record<string | symbol, unknown>
  const intersection = r[Intersection] as NormalizedJSONSchema | undefined
  if (!intersection) {
    return
  }

  if (Array.isArray(intersection.allOf)) {
    traverseArray(intersection.allOf, callback, processed)
  }
}

export function traverse(
  schema: LinkedJSONSchema,
  callback: (schema: LinkedJSONSchema, key: string | null) => void,
  processed = new Set<LinkedJSONSchema>(),
  key?: string,
): void {
  // Handle recursive schemas
  if (processed.has(schema)) {
    return
  }

  processed.add(schema)
  callback(schema, key ?? null)

  for (const [keyword, holds] of SUBSCHEMA_KEYWORDS) {
    const child = schema[keyword]
    if (!child) {
      continue
    }
    switch (holds) {
      case 'schema':
        traverse(child, callback, processed)
        break
      case 'schemaOrBoolean':
        if (typeof child === 'object') {
          traverse(child, callback, processed)
        }
        break
      case 'schemaOrSchemaArray':
        if (Array.isArray(child)) {
          traverseArray(child, callback, processed)
        } else {
          traverse(child, callback, processed)
        }
        break
      case 'schemaArray':
        traverseArray(child, callback, processed)
        break
      case 'schemaMap':
        traverseObjectKeys(child, callback, processed)
        break
    }
  }
  traverseIntersection(schema, callback, processed)

  // technically you can put definitions on any key
  Object.keys(schema)
    .filter(key => !NOT_SCANNED_FOR_DEFINITIONS.has(key))
    .forEach(key => {
      const child = schema[key]
      if (child && typeof child === 'object') {
        traverseObjectKeys(child, callback, processed)
      }
    })
}

/**
 * Walks every object/array reachable from `schema`, invoking `visit` on each plain
 * object node found outside instance data (`enum`, `default`...). `replace` swaps the node out in
 * its parent container, in place (a no-op for the root node, which has no parent).
 * Where `traverse` knows which keywords hold schemas and visits each node once, this
 * walk is keyword-agnostic (container objects such as a `properties` map are visited
 * too) and per occurrence:
 *
 * the same node object can be reachable from more than one parent/key (eg. two
 * schemas sharing a `$ref` node via a YAML alias, or a node the ref-parser already
 * folded into a cycle), so `visit` runs for every occurrence. Only the recursion
 * into a node's children is guarded against repeating -- via `seen` -- to keep
 * cycles from looping forever.
 */
export function eachSchemaNode(
  schema: unknown,
  visit: (node: JSONSchema, replace: (nextNode: JSONSchema) => void) => void,
  seen = new Set<unknown>(),
  parent?: any,
  key?: string,
): void {
  if (!schema || typeof schema !== 'object') {
    return
  }

  if (!Array.isArray(schema)) {
    visit(schema as JSONSchema, nextNode => {
      if (parent) {
        parent[key!] = nextNode
      }
    })
  }

  if (seen.has(schema)) {
    return
  }
  seen.add(schema)

  for (const childKey of Object.keys(schema)) {
    // instance data, never a nested schema, so an `$id`/`$ref` (or anything else) found
    // underneath is not schema vocabulary
    if (JSON_DATA_KEYWORDS.has(childKey)) {
      continue
    }
    eachSchemaNode((schema as any)[childKey], visit, seen, schema, childKey)
  }
}

/**
 * Eg. `foo/bar/baz.json` => `baz`
 *
 * `$ref`s that point into a document (eg `other.json#/definitions/v1.Foo` or
 * `#/definitions/v1.Foo`) are not file paths, so the part after `#` is a JSON
 * Pointer, not a filename with an extension: any `.` it contains is part of the
 * name and must not be stripped as though it were a file extension.
 */
export function justName(filename = ''): string {
  const hashIndex = filename.indexOf('#')
  if (hashIndex !== -1) {
    return basename(filename.slice(hashIndex + 1))
  }
  return stripExtension(basename(filename))
}

/**
 * Avoid appending "js" to top-level unnamed schemas
 */
export function stripExtension(filename: string): string {
  return filename.replace(extname(filename), '')
}

/**
 * Convert a string that might contain spaces or special characters to one that
 * can safely be used as a TypeScript interface or enum name.
 */
export function toSafeString(string: string): string {
  // identifiers in javaScript/ts:
  // First character: a-zA-Z | _ | $
  // Rest: a-zA-Z | _ | $ | 0-9

  return upperFirst(
    // remove accents, umlauts, ... by their basic latin letters
    deburr(string)
      // replace chars which are not valid for typescript identifiers with whitespace
      .replace(/(^\s*[^a-zA-Z_$])|([^a-zA-Z_$\d])/g, ' ')
      // uppercase leading underscores followed by lowercase
      .replace(/^_[a-z]/g, match => match.toUpperCase())
      // remove non-leading underscores followed by lowercase (convert snake_case)
      .replace(/_[a-z]/g, match => match.substr(1, match.length).toUpperCase())
      // uppercase letters after digits, dollars
      .replace(/([\d$]+[a-zA-Z])/g, match => match.toUpperCase())
      // uppercase first letter after whitespace
      .replace(/\s+([a-zA-Z])/g, match => trim(match.toUpperCase()))
      // remove remaining whitespace
      .replace(/\s/g, '')
      // strip any leading digits: they're valid elsewhere in an identifier, but
      // never as the first character (this can be exposed after prior chars are stripped above)
      .replace(/^\d+/, ''),
  )
}

// The next counter to try for each name, per `usedNames` set, so that the search for a free name
// carries on where the last one ended instead of counting up from 1 for every duplicate (a schema
// with thousands of same-named types -- one copy of a definition per `$ref` that has a sibling
// keyword, say -- would otherwise probe 1 + 2 + ... + n names). Names are only ever added to
// `usedNames`, so every smaller counter is still taken and the result is the same smallest free
// counter that counting from 1 would find.
const nextCounters = memoize<Set<string>, [], Map<string, number>>(() => new Map())

export function generateName(from: string, usedNames: Set<string>) {
  let name = toSafeString(from)
  if (!name) {
    name = 'NoName'
  }

  // increment counter until we find a free name
  if (usedNames.has(name)) {
    const counters = nextCounters(usedNames)
    let counter = counters.get(name) ?? 1
    while (usedNames.has(`${name}${counter}`)) {
      counter++
    }
    counters.set(name, counter + 1)
    name = `${name}${counter}`
  }

  usedNames.add(name)
  return name
}

/**
 * Annotation-only keywords that never affect the emitted type structure, excluded from the
 * structural hash (`ANNOTATION_KEYWORDS` from the keyword table, plus OpenAPI's singular
 * `example`). Every other key (including unknown ones) contributes to the hash, so the worst
 * case is a missed dedupe, never an incorrect one.
 */
export const DEFAULT_SCHEMA_HASH_IGNORE_KEYS: ReadonlySet<string> = new Set([...ANNOTATION_KEYWORDS, 'example'])

/**
 * Dereferenced schemas are DAGs with heavy sharing and true cycles (eg. fhir), so each
 * object is reduced bottom-up to a fixed-size SHA-1 digest, memoized per object -- O(nodes)
 * work and memory. `seen` tracks the active ancestor path; back-edges digest as a stable
 * identity marker so results are entry-point independent and safe to cache.
 */
interface HashContext {
  ignore: ReadonlySet<string>
  seen: WeakSet<object>
  depth: number
  schemaCache: WeakMap<object, string>
  plainCache: WeakMap<object, string>
}

// Past this depth sub-objects digest as their identity marker, bounding stack usage.
const MAX_HASH_DEPTH = 512

// Stable per-object markers for cycle back-references: same object -> same marker, so
// distinct-but-equal cyclic objects can at worst miss a dedupe, never collide.
const cyclicIds = new WeakMap<object, number>()
let nextCyclicId = 1
function cyclicMarker(obj: object): string {
  let cyclicId = cyclicIds.get(obj)
  if (cyclicId === undefined) {
    cyclicId = nextCyclicId++
    cyclicIds.set(obj, cyclicId)
  }
  return `[Cyclic#${cyclicId}]`
}

/** Digest a canonical description down to a fixed-size token. */
function digest(kind: string, payload: string): string {
  return createHash('sha1').update(kind).update(payload).digest('hex')
}

function isSchemaObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Digest a non-schema value (eg. `enum`, `const`, `default`). Keys are sorted but nothing
 * is stripped: a `default` object may contain a key literally named "description".
 */
function serializePlainForHash(value: unknown, ctx: HashContext): string {
  if (value === null || typeof value !== 'object') {
    return value === undefined ? 'null' : JSON.stringify(value)
  }
  const cached = ctx.plainCache.get(value)
  if (cached !== undefined) {
    return cached
  }
  if (ctx.seen.has(value) || ctx.depth >= MAX_HASH_DEPTH) {
    return cyclicMarker(value)
  }
  ctx.seen.add(value)
  ctx.depth++
  let serialized: string
  if (Array.isArray(value)) {
    serialized = digest('PA', value.map(item => serializePlainForHash(item, ctx)).join(','))
  } else {
    const parts: string[] = []
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      parts.push(`${JSON.stringify(key)}:${serializePlainForHash((value as Record<string, unknown>)[key], ctx)}`)
    }
    serialized = digest('PO', parts.join(','))
  }
  ctx.seen.delete(value)
  ctx.depth--
  ctx.plainCache.set(value, serialized)
  return serialized
}

// Schemas recurse with deny-list stripping; booleans (eg. `additionalProperties: false`),
// `dependencies`' string arrays and other non-schema values pass through unchanged.
function serializeSubschemaForHash(value: unknown, ctx: HashContext): string {
  if (isSchemaObject(value)) {
    return serializeSchemaForHash(value, ctx)
  }
  return serializePlainForHash(value, ctx)
}

/**
 * Recursively digest a schema into a fixed-size token. Deny-listed annotation keys are
 * stripped at every schema level; non-schema values are digested verbatim.
 */
function serializeSchemaForHash(schema: Record<string, unknown>, ctx: HashContext): string {
  const cached = ctx.schemaCache.get(schema)
  if (cached !== undefined) {
    return cached
  }
  if (ctx.seen.has(schema) || ctx.depth >= MAX_HASH_DEPTH) {
    return cyclicMarker(schema)
  }
  ctx.seen.add(schema)
  ctx.depth++

  const parts: string[] = []
  for (const key of Object.keys(schema).sort()) {
    if (ctx.ignore.has(key)) {
      continue
    }
    const value = schema[key]
    const holds = HASHED_SUBSCHEMA_KEYWORDS.get(key)

    if (holds === undefined) {
      parts.push(`${JSON.stringify(key)}:${serializePlainForHash(value, ctx)}`)
    } else if (holds === 'schemaMap') {
      if (isSchemaObject(value)) {
        const mapped: string[] = []
        for (const name of Object.keys(value).sort()) {
          mapped.push(`${JSON.stringify(name)}:${serializeSubschemaForHash(value[name], ctx)}`)
        }
        parts.push(`${JSON.stringify(key)}:{${mapped.join(',')}}`)
      } else {
        parts.push(`${JSON.stringify(key)}:${serializePlainForHash(value, ctx)}`)
      }
    } else if (Array.isArray(value)) {
      parts.push(`${JSON.stringify(key)}:[${value.map(item => serializeSubschemaForHash(item, ctx)).join(',')}]`)
    } else {
      parts.push(`${JSON.stringify(key)}:${serializeSubschemaForHash(value, ctx)}`)
    }
  }

  ctx.seen.delete(schema)
  ctx.depth--
  const serialized = digest('S', parts.join(','))
  ctx.schemaCache.set(schema, serialized)
  return serialized
}

// Digest caches for the default-ignoreKeys case, safe to share across compiles.
const defaultSchemaCache = new WeakMap<object, string>()
const defaultPlainCache = new WeakMap<object, string>()

/**
 * Generate a stable hash of a schema's structure, used to deduplicate generated types.
 * `ignoreKeys` adds annotation keys to exclude, on top of DEFAULT_SCHEMA_HASH_IGNORE_KEYS.
 */
export function getSchemaStructuralHash(schema: Record<string, unknown>, ignoreKeys?: Set<string> | string[]): string {
  if (!schema || typeof schema !== 'object') {
    return JSON.stringify(schema)
  }

  let ignore = DEFAULT_SCHEMA_HASH_IGNORE_KEYS
  if (ignoreKeys) {
    ignore = new Set([...DEFAULT_SCHEMA_HASH_IGNORE_KEYS, ...ignoreKeys])
  }

  const ctx: HashContext = {
    ignore,
    seen: new WeakSet<object>(),
    depth: 0,
    schemaCache: ignoreKeys ? new WeakMap() : defaultSchemaCache,
    plainCache: ignoreKeys ? new WeakMap() : defaultPlainCache,
  }

  return serializeSchemaForHash(schema, ctx)
}

export function error(...messages: any[]): void {
  if (!process.env.VERBOSE) {
    return console.error(messages)
  }
  console.error(getStyledTextForLogging('red')?.('error'), ...messages)
}

type LogStyle = 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'white' | 'yellow'

export function log(style: LogStyle, title: string, ...messages: unknown[]): void {
  if (!process.env.VERBOSE) {
    return
  }
  let lastMessage = null
  if (messages.length > 1 && typeof messages[messages.length - 1] !== 'string') {
    lastMessage = messages.splice(messages.length - 1, 1)
  }
  console.info(color()?.whiteBright.bgCyan('debug'), getStyledTextForLogging(style)?.(title), ...messages)
  if (lastMessage) {
    console.dir(lastMessage, {depth: 6, maxArrayLength: 6})
  }
}

function getStyledTextForLogging(style: LogStyle): ((text: string) => string) | undefined {
  if (!process.env.VERBOSE) {
    return
  }
  switch (style) {
    case 'blue':
      return color()?.whiteBright.bgBlue
    case 'cyan':
      return color()?.whiteBright.bgCyan
    case 'green':
      return color()?.whiteBright.bgGreen
    case 'magenta':
      return color()?.whiteBright.bgMagenta
    case 'red':
      return color()?.whiteBright.bgRedBright
    case 'white':
      return color()?.black.bgWhite
    case 'yellow':
      return color()?.whiteBright.bgYellow
  }
}

/**
 * escape block comments in schema descriptions so that they don't unexpectedly close JSDoc comments in generated typescript interfaces
 */
export function escapeBlockComment(schema: JSONSchema) {
  const replacer = '* /'
  if (schema === null || typeof schema !== 'object') {
    return
  }
  for (const key of Object.keys(schema)) {
    if (key === 'description' && typeof schema[key] === 'string') {
      schema[key] = schema[key]!.replace(/\*\//g, replacer)
    }
  }
}

/*
the following logic determines the out path by comparing the in path to the users specified out path.
For example, if input directory MultiSchema looks like:
  MultiSchema/foo/a.json
  MultiSchema/bar/fuzz/c.json
  MultiSchema/bar/d.json
And the user wants the outputs to be in MultiSchema/Out, then this code will be able to map the inner directories foo, bar, and fuzz into the intended Out directory like so:
  MultiSchema/Out/foo/a.json
  MultiSchema/Out/bar/fuzz/c.json
  MultiSchema/Out/bar/d.json
*/
export function pathTransform(outputPath: string, inputPath: string, filePath: string): string {
  const inPathList = normalize(inputPath).split(sep)
  const filePathList = dirname(normalize(filePath)).split(sep)
  const filePathRel = filePathList.filter((f, i) => f !== inPathList[i])

  return posix.join(posix.normalize(outputPath), ...filePathRel)
}

export function hasType(schema: JSONSchema, type: JSONSchemaTypeName): boolean {
  return schema.type === type || (Array.isArray(schema.type) && schema.type.includes(type))
}

/**
 * Removes the schema's `default` property if it doesn't match the schema's `type` property.
 * Useful when parsing unions.
 *
 * Mutates `schema`.
 */
export function maybeStripDefault(schema: LinkedJSONSchema): LinkedJSONSchema {
  if (!('default' in schema)) {
    return schema
  }

  switch (schema.type) {
    case 'array':
      if (Array.isArray(schema.default)) {
        return schema
      }
      break
    case 'boolean':
      if (typeof schema.default === 'boolean') {
        return schema
      }
      break
    case 'integer':
    case 'number':
      if (typeof schema.default === 'number') {
        return schema
      }
      break
    case 'string':
      if (typeof schema.default === 'string') {
        return schema
      }
      break
    case 'null':
      if (schema.default === null) {
        return schema
      }
      break
    case 'object':
      if (isPlainObject(schema.default)) {
        return schema
      }
      break
  }
  delete schema.default
  return schema
}

export function appendToDescription(existingDescription: string | undefined, ...values: string[]): string {
  if (existingDescription) {
    return `${existingDescription}\n\n${values.join('\n')}`
  }
  return values.join('\n')
}

export function isSchemaLike(schema: any): schema is LinkedJSONSchema {
  if (!isPlainObject(schema)) {
    return false
  }

  // top-level schema
  const parent = schema[Parent]
  if (parent === null) {
    return true
  }

  for (const keyword of CONTAINER_KEYWORDS) {
    if (parent[keyword] === schema) {
      return false
    }
  }
  return true
}

/**
 * js-yaml@5 loads with CORE_SCHEMA by default, which drops the extra tags that
 * js-yaml@4's default schema carried. Re-add exactly those tags so that YAML
 * schemas keep parsing the way they did under js-yaml@4.
 *
 * Note that YAML11_SCHEMA is NOT the right choice here: on top of these tags it
 * also enables the YAML 1.1 scalar notations, under which `y`, `n`, `yes`, `no`,
 * `on` and `off` resolve to booleans, `0777` is octal, and `12:30` is
 * sexagesimal. That silently rewrites property names (a property called `y`
 * becomes `true`) and enum values, which js-yaml@4 never did.
 */
const JS_YAML_4_SCHEMA = CORE_SCHEMA.withTags(mergeTag, timestampTag, binaryTag, omapTag, pairsTag, setTag)

export function parseFileAsJSONSchema(filename: string | null, contents: string): JSONSchema4 {
  if (filename != null && isYaml(filename)) {
    return Try(
      () => loadYaml(contents.toString(), {schema: JS_YAML_4_SCHEMA}) as JSONSchema4,
      () => {
        throw new TypeError(`Error parsing YML in file "${filename}"`)
      },
    )
  }

  return Try(
    () => JSON.parse(contents.toString()),
    () => {
      throw new TypeError(`Error parsing JSON in file "${filename}"`)
    },
  )
}

function isYaml(filename: string) {
  return filename.endsWith('.yaml') || filename.endsWith('.yml')
}

function color(): Format {
  let cliColor
  try {
    cliColor = require('cli-color')
  } catch {}
  return cliColor
}
