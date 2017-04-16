// import { JSONSchema } from './types/JSONSchema'
// import { dft, Try } from './utils'
// import { readFileSync } from 'fs'
// import { uniq } from 'lodash'

// /**
//  * Crawls a JSONSchema's $refs, and returns a list of all
//  * referenced schemas
//  */
// export function collectRefs(schema: JSONSchema): { [schemaId: string]: JSONSchema } {
//   const schemas: { [schemaId: string]: JSONSchema } = {}

//   const $refs: string[] = []
//   dft(schema, (value: string, key: string) => {
//     if (key === '$ref') $refs.push(value)
//   })

// }

// export function readSchema(filename: string): JSONSchema {
//   const contents = Try(
//     () => readFileSync(filename),
//     () => { throw new ReferenceError(`Unable to read file "${filename}"`) }
//   )
//   return Try<JSONSchema>(
//     () => JSON.parse(contents.toString()),
//     () => { throw new TypeError(`Error parsing JSON in file "${filename}"`)}
//   )
// }

// function getSchemaId(schema: JSONSchema): string {
//   return schema.id || 'Interface1'
// }

import $RefParser = require('json-schema-ref-parser')
import { JSONSchema } from './types/JSONSchema'
import { log } from "./utils";
import { whiteBright } from 'cli-color'

export async function dereference(schema: JSONSchema, cwd: string): Promise<JSONSchema> {
  log(whiteBright.bgGreen('resolver'), schema, cwd)
  const parser = new $RefParser
  return parser.dereference(schema, cwd)
}
