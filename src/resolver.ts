import $RefParser from 'json-schema-ref-parser'
import {dirname} from 'path'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefParser.Options},
  filepath?: string
): Promise<JSONSchema> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()

  return parser.dereference(filepath ? `${cwd}${dirname(filepath)}/.` : cwd, schema, $refOptions)
}
