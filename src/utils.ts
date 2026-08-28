import {deburr, isPlainObject, trim, upperFirst} from 'lodash'
import {basename, dirname, extname, normalize, sep, posix} from 'path'
import {Intersection, JSONSchema, LinkedJSONSchema, NormalizedJSONSchema, Parent} from './types/JSONSchema'
import {memoize} from './memoize'
import {JSONSchema4} from 'json-schema'
import {binaryTag, CORE_SCHEMA, load as loadYaml, mergeTag, omapTag, pairsTag, setTag, timestampTag} from 'js-yaml'
import type {Format} from 'cli-color'

// TODO: pull out into a separate package
export function Try<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}

// keys that shouldn't be traversed by the catchall step
const BLACKLISTED_KEYS = new Set([
  'id',
  '$defs',
  '$id',
  '$schema',
  'title',
  'description',
  'default',
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'additionalItems',
  'items',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxProperties',
  'minProperties',
  'required',
  'additionalProperties',
  'unevaluatedProperties',
  'definitions',
  'properties',
  'patternProperties',
  'dependencies',
  'enum',
  'type',
  'allOf',
  'anyOf',
  'oneOf',
  'not',
])

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

  if (schema.anyOf) {
    traverseArray(schema.anyOf, callback, processed)
  }
  if (schema.allOf) {
    traverseArray(schema.allOf, callback, processed)
  }
  if (schema.oneOf) {
    traverseArray(schema.oneOf, callback, processed)
  }
  if (schema.properties) {
    traverseObjectKeys(schema.properties, callback, processed)
  }
  if (schema.patternProperties) {
    traverseObjectKeys(schema.patternProperties, callback, processed)
  }
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    traverse(schema.additionalProperties, callback, processed)
  }
  if (schema.unevaluatedProperties && typeof schema.unevaluatedProperties === 'object') {
    traverse(schema.unevaluatedProperties, callback, processed)
  }
  if (schema.items) {
    const {items} = schema
    if (Array.isArray(items)) {
      traverseArray(items, callback, processed)
    } else {
      traverse(items, callback, processed)
    }
  }
  if (schema.additionalItems && typeof schema.additionalItems === 'object') {
    traverse(schema.additionalItems, callback, processed)
  }
  if (schema.dependencies) {
    if (Array.isArray(schema.dependencies)) {
      traverseArray(schema.dependencies, callback, processed)
    } else {
      traverseObjectKeys(schema.dependencies as LinkedJSONSchema, callback, processed)
    }
  }
  if (schema.definitions) {
    traverseObjectKeys(schema.definitions, callback, processed)
  }
  if (schema.$defs) {
    traverseObjectKeys(schema.$defs, callback, processed)
  }
  if (schema.not) {
    traverse(schema.not, callback, processed)
  }
  traverseIntersection(schema, callback, processed)

  // technically you can put definitions on any key
  Object.keys(schema)
    .filter(key => !BLACKLISTED_KEYS.has(key))
    .forEach(key => {
      const child = schema[key]
      if (child && typeof child === 'object') {
        traverseObjectKeys(child, callback, processed)
      }
    })
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

  const JSON_SCHEMA_KEYWORDS = [
    '$defs',
    'allOf',
    'anyOf',
    'definitions',
    'dependencies',
    'enum',
    'not',
    'oneOf',
    'patternProperties',
    'properties',
    'required',
  ]
  if (JSON_SCHEMA_KEYWORDS.some(_ => parent[_] === schema)) {
    return false
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
