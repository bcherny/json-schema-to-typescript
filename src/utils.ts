import { whiteBright } from 'cli-color'
import { camelCase, isPlainObject, mapValues, upperFirst } from 'lodash'
import { basename, extname } from 'path'

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

export function mapDeep<T, U>(
  object: Obj<T>,
  fn: (value: Obj<T>, key?: string) => Obj<U>,
  key?: string
): Obj<U> {
  return fn(mapValues(object, (_, key) =>
    isPlainObject(_) ? mapDeep(_, fn, key) : _
  ), key)
}

export type Obj<T> = { [k: string]: T }

/**
 * Eg. `foo/bar/baz.json` => `baz`
 */
export function justName(filename: string): string {
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
 *
 * TODO: be non-destructive for caps (eg. "fooBAR" is ok, and shouldn't be converted to "fooBar")
 */
export function toSafeString(string: string) {
  return upperFirst(camelCase(string))
}

export function error(...messages: any[]) {
  console.error(whiteBright.bgRedBright('error'), ...messages)
}

export function log(...messages: any[]) {
  if (process.env.DEBUG) {
    console.info(whiteBright.bgCyan('debug'), ...messages)
  }
}
