import {deburr, isPlainObject, mapValues, trim, upperFirst} from 'lodash'
import {basename, dirname, extname, join, normalize, sep} from 'path'
import {JSONSchema, LinkedJSONSchema} from './types/JSONSchema'

// TODO: pull out into a separate package
// eslint-disable-next-line
export function Try<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}

export function mapDeep(object: object, fn: (value: object, key?: string) => object, key?: string): object {
  return fn(
    mapValues(object, (_: unknown, key) => {
      if (isPlainObject(_)) {
        return mapDeep(_ as object, fn, key)
      } else if (Array.isArray(_)) {
        return _.map(item => {
          if (isPlainObject(item)) {
            return mapDeep(item as object, fn, key)
          }
          return item
        })
      }
      return _
    }),
    key
  )
}

// keys that shouldn't be traversed by the catchall step
const BLACKLISTED_KEYS = new Set([
  'id',
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
  'definitions',
  'properties',
  'patternProperties',
  'dependencies',
  'enum',
  'type',
  'allOf',
  'anyOf',
  'oneOf',
  'not'
])

function traverseObjectKeys(
  obj: Record<string, LinkedJSONSchema>,
  callback: (schema: LinkedJSONSchema) => void,
  processed: Set<LinkedJSONSchema>
) {
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      traverse(obj[k], callback, processed)
    }
  })
}
function traverseArray(
  arr: LinkedJSONSchema[],
  callback: (schema: LinkedJSONSchema) => void,
  processed: Set<LinkedJSONSchema>
) {
  arr.forEach(i => traverse(i, callback, processed))
}
export function traverse(
  schema: LinkedJSONSchema,
  callback: (schema: LinkedJSONSchema) => void,
  processed = new Set<LinkedJSONSchema>()
): void {
  // Handle recursive schemas
  if (processed.has(schema)) {
    return
  }

  processed.add(schema)
  callback(schema)

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
  if (schema.not) {
    traverse(schema.not, callback, processed)
  }

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
 */
export function justName(filename = ''): string {
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
export function toSafeString(string: string) {
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
  )
}

export function generateName(from: string, usedNames: Set<string>) {
  let name = toSafeString(from)
  if (!name) {
    name = 'NoName'
  }

  // increment counter until we find a free name
  if (usedNames.has(name)) {
    let counter = 1
    let nameWithCounter = `${name}${counter}`
    while (usedNames.has(nameWithCounter)) {
      nameWithCounter = `${name}${counter}`
      counter++
    }
    name = nameWithCounter
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
  console.info(require('cli-color').whiteBright.bgCyan('debug'), getStyledTextForLogging(style)?.(title), ...messages)
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
      return require('cli-color').whiteBright.bgBlue
    case 'cyan':
      return require('cli-color').whiteBright.bgCyan
    case 'green':
      return require('cli-color').whiteBright.bgGreen
    case 'magenta':
      return require('cli-color').whiteBright.bgMagenta
    case 'red':
      return require('cli-color').whiteBright.bgRedBright
    case 'white':
      return require('cli-color').black.bgWhite
    case 'yellow':
      return require('cli-color').whiteBright.bgYellow
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

  return join(normalize(outputPath), ...filePathRel)
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

/**
 * Removes the schema's `id`, `name`, and `description` properties
 * if they exist.
 * Useful when parsing intersections.
 *
 * Mutates `schema`.
 */
export function maybeStripNameHints(schema: JSONSchema): JSONSchema {
  if ('description' in schema) {
    delete schema.description
  }
  if ('id' in schema) {
    delete schema.id
  }
  if ('name' in schema) {
    delete schema.name
  }
  return schema
}
