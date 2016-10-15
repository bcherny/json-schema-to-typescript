import { isPlainObject } from 'lodash'
import { basename } from 'path'

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

/**
 * Avoid appending "Js" to top-level unnamed schemas
 */
export function stripExtension(filename: string): string {
  return basename(filename, '.js')
}
