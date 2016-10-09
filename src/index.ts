import { generate } from './generator'
import { JSONSchema } from './JSONSchema'
import { normalize } from './normalizer'
import { parse } from './parser'
import { Try } from './utils'
import { readFileSync } from 'fs'

export interface Options {
  enableTrailingSemicolon: boolean
  indentWith: string
}

export function compileFromFile(
  filename: string,
  options: Options
): string | NodeJS.ErrnoException {
  const contents = Try(
    () => readFileSync(filename),
    () => { throw new ReferenceError(`Unable to read file "${filename}"`) }
  )
  const schema = Try<JSONSchema>(
    () => JSON.parse(contents.toString()),
    () => { throw new TypeError(`Error parsing JSON in file "${filename}"`)}
  )
  return compile(schema, options)
}

export function compile(
  schema: JSONSchema,
  options: Options
): string | NodeJS.ErrnoException {
  return generate(parse(normalize(schema)), options)
}
