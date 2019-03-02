import { whiteBright } from 'cli-color'
import { deburr, isPlainObject, mapValues, trim, upperFirst } from 'lodash'
import { basename, extname } from 'path'
import { JSONSchema } from './types/JSONSchema'

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
export function dft<T, U>(object: { [k: string]: any }, cb: (value: U, key: string) => T): void {
  for (let key in object) {
    if (!object.hasOwnProperty(key)) continue
    if (isPlainObject(object[key])) dft(object[key], cb)
    cb(object[key], key)
  }
}

export function mapDeep(
  object: object,
  fn: (value: object, key?: string) => object,
  key?: string
): object {
  return fn(mapValues(object, (_, key) =>
    isPlainObject(_) ? mapDeep(_, fn, key) : _
  ), key)
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
    .replace(/\s/g, ''))
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
