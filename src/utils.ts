import {deburr, trim, upperFirst, isPlainObject} from 'lodash'
import {basename, dirname, extname, join, normalize, sep} from 'path'
import {JSONSchema} from './types/JSONSchema'

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

type TraversalState = {isRoot: boolean; traversed: WeakSet<JSONSchema>}

function traverseObjectKeys(
  obj: Record<string, JSONSchema>,
  callback: (schema: JSONSchema, isRoot: boolean) => void,
  state: TraversalState
) {
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      traverse(obj[k], callback, state)
    }
  })
}

function traverseArray(
  arr: JSONSchema[],
  callback: (schema: JSONSchema, isRoot: boolean) => void,
  state: TraversalState
) {
  arr.forEach(i => traverse(i, callback, state))
}

export function traverse(
  schema: JSONSchema,
  callback: (schema: JSONSchema, isRoot: boolean) => void,
  {isRoot, traversed}: TraversalState = {isRoot: true, traversed: new WeakSet()}
): void {
  if (traversed.has(schema)) {
    return
  }
  traversed.add(schema)
  callback(schema, isRoot)

  if (schema.anyOf) {
    traverseArray(schema.anyOf, callback, {isRoot: false, traversed})
  }
  if (schema.allOf) {
    traverseArray(schema.allOf, callback, {isRoot: false, traversed})
  }
  if (schema.oneOf) {
    traverseArray(schema.oneOf, callback, {isRoot: false, traversed})
  }
  if (schema.properties) {
    traverseObjectKeys(schema.properties, callback, {isRoot: false, traversed})
  }
  if (schema.patternProperties) {
    traverseObjectKeys(schema.patternProperties, callback, {isRoot: false, traversed})
  }
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    traverse(schema.additionalProperties, callback, {isRoot: false, traversed})
  }
  if (schema.items) {
    const {items} = schema
    if (Array.isArray(items)) {
      traverseArray(items, callback, {isRoot: false, traversed})
    } else {
      traverse(items, callback, {isRoot: false, traversed})
    }
  }
  if (schema.additionalItems && typeof schema.additionalItems === 'object') {
    traverse(schema.additionalItems, callback, {isRoot: false, traversed})
  }
  if (schema.dependencies) {
    traverseObjectKeys(schema.dependencies, callback, {isRoot: false, traversed})
  }
  if (schema.definitions) {
    traverseObjectKeys(schema.definitions, callback, {isRoot: false, traversed})
  }
  if (schema.not) {
    traverse(schema.not, callback, {isRoot: false, traversed})
  }

  // technically you can put definitions on any key
  Object.keys(schema)
    .filter(key => !BLACKLISTED_KEYS.has(key))
    .forEach(key => {
      const child = schema[key]
      if (isPlainObject(child)) {
        traverseObjectKeys(child, callback, {isRoot: false, traversed})
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

export function error(...messages: any[]) {
  console.error(require('cli-color').whiteBright.bgRedBright('error'), ...messages)
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
