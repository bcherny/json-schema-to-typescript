import { readFileSync } from 'fs'
import { generate } from './generator'
import { normalize } from './normalizer'
import { parse } from './parser'
import { JSONSchema4 } from 'json-schema'
import { stripExtension, Try, error } from './utils'
import { validate } from './validator'
import { dereference } from "./refResolver";

export interface Options {
  declareReferenced: boolean
  enableConstEnums: boolean
  enableTrailingSemicolonForTypes: boolean
  enableTrailingSemicolonForEnums: boolean
  enableTrailingSemicolonForInterfaceProperties: boolean
  enableTrailingSemicolonForInterfaces: boolean
  indentWith: string
}

export const DEFAULT_OPTIONS: Options = {
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
): Promise<string | NodeJS.ErrnoException> {
  const contents = Try(
    () => readFileSync(filename),
    () => { throw new ReferenceError(`Unable to read file "${filename}"`) }
  )
  const schema = Try<JSONSchema4>(
    () => JSON.parse(contents.toString()),
    () => { throw new TypeError(`Error parsing JSON in file "${filename}"`)}
  )
  return compile(schema, stripExtension(filename), options)
}

export async function compile(
  schema: JSONSchema4,
  name: string,
  options = DEFAULT_OPTIONS
): Promise<string | NodeJS.ErrnoException> {
  const errors = validate(schema, name)
  if (errors.length) {
    errors.forEach(_ => error(_))
    throw ValidationError
  }
  await dereference(normalize(schema, name))
  return generate(
    parse(normalize(await dereference(schema), name)),
    Object.assign({}, DEFAULT_OPTIONS, options))
}

export class ValidationError extends Error {}
