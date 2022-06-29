import $RefParser = require('@apidevtools/json-schema-ref-parser')
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefParser.Options}
): Promise<JSONSchema> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  return parser.dereference(cwd, schema as any, $refOptions) as any // TODO: fix types
}
