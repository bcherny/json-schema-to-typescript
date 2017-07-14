import $RefParser = require('json-schema-ref-parser')
import { whiteBright } from 'cli-color'
import { JSONSchema } from './types/JSONSchema'
import { log } from './utils'

export async function dereference(schema: JSONSchema, cwd: string): Promise<JSONSchema> {
  log(whiteBright.bgGreen('resolver'), schema, cwd)
  const parser = new $RefParser
  return (parser.dereference as any)(cwd, schema, { dereference: { onAfterDereference } })
}

function onAfterDereference<T extends { __$ref: boolean }>(json: T): T {
  json.__$ref = true
  return json
}
