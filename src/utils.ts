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
import type {Options} from './'
import {CONTAINER_KEYWORDS, JSON_DATA_KEYWORDS, NOT_SCANNED_FOR_DEFINITIONS, SUBSCHEMA_KEYWORDS} from './keywords'

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

/** Each subschema keyword's position in `traverse`'s visiting order */
const SUBSCHEMA_KEYWORD_ORDER = new Map(SUBSCHEMA_KEYWORDS.map(([keyword], order) => [keyword as string, order]))

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

  // One look at the node's own keys (rather than a probe for every subschema keyword there is,
  // most of which any one node lacks) finds the subschema keywords it has, visited first in
  // keyword-table order, and the keys that definitions may technically sit under, visited after
  const subschemaKeywords: number[] = []
  const otherKeys: string[] = []
  for (const key of Object.keys(schema)) {
    const order = SUBSCHEMA_KEYWORD_ORDER.get(key)
    if (order !== undefined) {
      subschemaKeywords.push(order)
    }
    if (!NOT_SCANNED_FOR_DEFINITIONS.has(key)) {
      otherKeys.push(key)
    }
  }

  for (const i of subschemaKeywords.sort((a, b) => a - b)) {
    const [keyword, holds] = SUBSCHEMA_KEYWORDS[i]
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
  const intersection = (schema as NormalizedJSONSchema)[Intersection]
  if (intersection && Array.isArray(intersection.allOf)) {
    traverseArray(intersection.allOf, callback, processed)
  }

  for (const key of otherKeys) {
    const child = schema[key]
    if (child && typeof child === 'object') {
      traverseObjectKeys(child, callback, processed)
    }
  }
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

export function error(...messages: any[]): void {
  if (!process.env.VERBOSE) {
    return console.error(messages)
  }
  console.error(getStyledTextForLogging('red')?.('error'), ...messages)
}

type LogStyle = 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'white' | 'yellow'

/**
 * Whether `log()` prints: the VERBOSE environment variable, re-read at the start of every
 * `compile()` (`readVerbose`) rather than on every call -- `log()` is called for every schema
 * node and every generated type, and a `process.env` read is not free.
 */
let verbose = Boolean(process.env.VERBOSE)

export function readVerbose(): void {
  verbose = Boolean(process.env.VERBOSE)
}

export function log(style: LogStyle, title: string, ...messages: unknown[]): void {
  if (!verbose) {
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

type TypeKeyword = JSONSchemaTypeName | JSONSchemaTypeName[]

/**
 * What is left of `schema`'s `type` once a schema of type `bound` must hold too (`integer` being
 * the whole-number part of `number`): `false` if no type is left, the narrower `type` if some of
 * it goes, `undefined` if `bound` takes nothing away (or `schema` declares no `type` to narrow).
 */
export function narrowType(schema: JSONSchema | boolean, bound: TypeKeyword): TypeKeyword | false | undefined {
  if (typeof schema !== 'object' || !schema || schema.type === undefined || schema.type === 'any') {
    return undefined
  }
  const bounds: readonly JSONSchemaTypeName[] = Array.isArray(bound) ? bound : [bound]
  if (bounds.includes('any')) {
    return undefined
  }
  const types: readonly JSONSchemaTypeName[] = Array.isArray(schema.type) ? schema.type : [schema.type]
  const narrowed = types.flatMap((type): JSONSchemaTypeName[] =>
    bounds.includes(type) || (type === 'integer' && bounds.includes('number'))
      ? [type]
      : type === 'number' && bounds.includes('integer')
        ? ['integer']
        : [],
  )
  if (!narrowed.length) {
    return false
  }
  if (narrowed.length === types.length && narrowed.every((type, i) => type === types[i])) {
    return undefined
  }
  return narrowed.length === 1 ? narrowed[0] : narrowed
}

/**
 * Whether a value of type `bound` can match `schema` as far as `type`s go: its own, and those of
 * its `anyOf`/`oneOf` members (a boolean schema admits everything or nothing).
 */
export function admitsType(schema: JSONSchema | boolean, bound: TypeKeyword, seen = new Set<JSONSchema>()): boolean {
  if (typeof schema !== 'object' || !schema || seen.has(schema)) {
    return schema !== false
  }
  if (narrowType(schema, bound) === false) {
    return false
  }
  seen.add(schema)
  return (['anyOf', 'oneOf'] as const).every(
    key => schema[key]?.some(member => admitsType(member, bound, seen)) ?? true,
  )
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
  if (filename != null && (filename.endsWith('.yaml') || filename.endsWith('.yml'))) {
    try {
      return loadYaml(contents, {schema: JS_YAML_4_SCHEMA}) as JSONSchema4
    } catch {
      throw new TypeError(`Error parsing YML in file "${filename}"`)
    }
  }
  try {
    return JSON.parse(contents)
  } catch {
    throw new TypeError(`Error parsing JSON in file "${filename}"`)
  }
}

function color(): Format {
  let cliColor
  try {
    cliColor = require('cli-color')
  } catch {}
  return cliColor
}

/** The TypeScript type the `formatTypes` option maps this schema's `format` to, if any */
export function formatTypeOf(schema: JSONSchema, options: Options): string | undefined {
  return typeof schema.format === 'string' && Object.prototype.hasOwnProperty.call(options.formatTypes, schema.format)
    ? options.formatTypes[schema.format]
    : undefined
}

/**
 * Schema keys are attacker/document-controlled and may include names like
 * `__proto__`: plain `obj[key] = value` assignment goes through the prototype
 * chain's setters, so a `__proto__` key would reassign obj's actual prototype
 * instead of setting a data property. Define the property directly instead.
 */
export function setOwn(obj: object, key: string, value: unknown): void {
  Object.defineProperty(obj, key, {value, writable: true, enumerable: true, configurable: true})
}

/**
 * Deep-copies the arrays and plain objects a schema is made of -- the nodes
 * `link` will annotate and the normalizer will rewrite -- so that compiling
 * never touches the caller's object. Every other value (a function under a
 * custom keyword, a `Date` from a YAML timestamp, a class instance) is carried
 * over by reference: the compiler reads such values but never writes to them.
 * A node reachable along several paths, or through a cycle, is copied once, so
 * the copy shares structure exactly where the input does.
 *
 * Not lodash's `cloneDeep` because its seen-set fails lodash's own "is `Map`
 * native" check under bun (see memoize.ts) and degrades to a linearly scanned
 * list, which makes the copy quadratic in the number of schema nodes.
 */
export function cloneDeepPlain<T>(value: T, copies = new Map<object, unknown>()): T {
  if (typeof value !== 'object' || value === null) {
    return value
  }
  const copied = copies.get(value)
  if (copied !== undefined) {
    return copied as T
  }
  if (Array.isArray(value)) {
    const copy: unknown[] = new Array(value.length)
    copies.set(value, copy)
    for (let i = 0; i < value.length; i++) {
      copy[i] = cloneDeepPlain(value[i], copies)
    }
    return copy as T
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null && !isPlainObject(value)) {
    return value
  }
  const copy: Record<string, unknown> = {}
  copies.set(value, copy)
  for (const key of Object.keys(value)) {
    const member = cloneDeepPlain((value as Record<string, unknown>)[key], copies)
    if (key === '__proto__') {
      setOwn(copy, key, member)
    } else {
      copy[key] = member
    }
  }
  return copy as T
}
