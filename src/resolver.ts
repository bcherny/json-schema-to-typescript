import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {DereferencedJSONSchema, JSONSchema, Ref} from './types/JSONSchema'
import {log} from './utils'

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<DereferencedJSONSchema> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        if (Ref in schema) {
          // TODO: What to do with >1 name for the same ref?
          return
        }
        Object.defineProperty(schema, Ref, {value: $ref})
      },
    },
  })) as DereferencedJSONSchema // TODO: fix types
  return dereferencedSchema
}
