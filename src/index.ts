import { readFileSync } from 'fs'
import { JSONSchema4 } from 'json-schema'
import { dirname } from 'path'
import { generate } from './generator'
import { normalize } from './normalizer'
import { parse } from './parser'
import { dereference } from './refResolver'
import { error, stripExtension, Try } from './utils'
import { validate } from './validator'

export interface Options {
  cwd: string
  declareReferenced: boolean
  enableConstEnums: boolean
  enableTrailingSemicolonForTypes: boolean
  enableTrailingSemicolonForEnums: boolean
  enableTrailingSemicolonForInterfaceProperties: boolean
  enableTrailingSemicolonForInterfaces: boolean
  indentWith: string
}

export const DEFAULT_OPTIONS: Options = {
  cwd: process.cwd(),
  declareReferenced: true,
  enableConstEnums: true, // by default, avoid generating code
  enableTrailingSemicolonForEnums: false,
  enableTrailingSemicolonForInterfaceProperties: true,
  enableTrailingSemicolonForInterfaces: false,
  enableTrailingSemicolonForTypes: true,
  indentWith: '  '
}

export function compileFromFile(
  filename: string,
  options = DEFAULT_OPTIONS
): Promise<string> {
  const contents = Try(
    () => readFileSync(filename),
    () => { throw new ReferenceError(`Unable to read file "${filename}"`) }
  )
  const schema = Try<JSONSchema4>(
    () => JSON.parse(contents.toString()),
    () => { throw new TypeError(`Error parsing JSON in file "${filename}"`)}
  )
  return compile(
    schema,
    stripExtension(filename),
    {...options, cwd: dirname(filename) }
  )
}

export async function compile(
  schema: JSONSchema4,
  name: string,
  options = DEFAULT_OPTIONS
): Promise<string> {
  const errors = validate(schema, name)
  if (errors.length) {
    errors.forEach(_ => error(_))
    throw new ValidationError
  }
  return generate(
    parse(await dereference(normalize(schema, name), options.cwd)),
    { ...DEFAULT_OPTIONS, ...options }
  )
}

export class ValidationError extends Error {}
