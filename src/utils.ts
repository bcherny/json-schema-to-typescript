import {whiteBright} from 'cli-color'
import {deburr, isPlainObject, mapValues, trim, upperFirst} from 'lodash'
import {basename, extname, join} from 'path'
import {JSONSchema} from './types/JSONSchema'

// TODO: pull out into a separate package
export function Try<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}

/**
 * Depth-first traversal
 */
export function dft<T, U>(object: {[k: string]: any}, cb: (value: U, key: string) => T): void {
  for (const key in object) {
    if (!object.hasOwnProperty(key)) continue
    if (isPlainObject(object[key])) dft(object[key], cb)
    cb(object[key], key)
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
function traverseObjectKeys(obj: Record<string, JSONSchema>, callback: (schema: JSONSchema) => void) {
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      traverse(obj[k], callback)
    }
  })
}
function traverseArray(arr: JSONSchema[], callback: (schema: JSONSchema) => void) {
  arr.forEach(i => traverse(i, callback))
}
export function traverse(schema: JSONSchema, callback: (schema: JSONSchema) => void): void {
  callback(schema)

  if (schema.anyOf) {
    traverseArray(schema.anyOf, callback)
  }
  if (schema.allOf) {
    traverseArray(schema.allOf, callback)
  }
  if (schema.oneOf) {
    traverseArray(schema.oneOf, callback)
  }
  if (schema.properties) {
    traverseObjectKeys(schema.properties, callback)
  }
  if (schema.patternProperties) {
    traverseObjectKeys(schema.patternProperties, callback)
  }
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    traverse(schema.additionalProperties, callback)
  }
  if (schema.items) {
    const {items} = schema
    if (Array.isArray(items)) {
      traverseArray(items, callback)
    } else {
      traverse(items, callback)
    }
  }
  if (schema.additionalItems && typeof schema.additionalItems === 'object') {
    traverse(schema.additionalItems, callback)
  }
  if (schema.dependencies) {
    traverseObjectKeys(schema.dependencies, callback)
  }
  if (schema.definitions) {
    traverseObjectKeys(schema.definitions, callback)
  }
  if (schema.not) {
    traverse(schema.not, callback)
  }

  // technically you can put definitions on any key
  Object.keys(schema)
    .filter(key => !BLACKLISTED_KEYS.has(key))
    .forEach(key => {
      const child = schema[key]
      if (child && typeof child === 'object') {
        traverseObjectKeys(child, callback)
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

  // increment counter until we find a free name
  if (usedNames.has(name)) {
    let counter = 1
    while (usedNames.has(name)) {
      name = `${toSafeString(from)}${counter}`
      counter++
    }
  }

  usedNames.add(name)
  return name
}

export function error(...messages: any[]) {
  console.error(whiteBright.bgRedBright('error'), ...messages)
}

export function log(...messages: any[]) {
  if (process.env.VERBOSE) {
    console.info(whiteBright.bgCyan('debug'), ...messages)
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
export function pathTransform(o: string, i: string): string {
  const outPathList = o.split('/')
  const inPathList = i.split('/')

  const intersection = outPathList.filter(x => inPathList.includes(x))
  const symmetricDifference = outPathList
    .filter(x => !inPathList.includes(x))
    .concat(inPathList.filter(x => !outPathList.includes(x)))

  return join(...intersection, ...symmetricDifference)
}
