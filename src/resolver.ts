import $RefParser from 'json-schema-ref-parser'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefParser.Options}
): Promise<[JSONSchema, Map<JSONSchema, Set<string>>]> {
  log('green', 'resolver', schema, cwd)
  const map = new Map<JSONSchema, Set<string>>()
  const result = await ($RefParser as any).dereference(cwd, schema, {
    ...$refOptions,
    dereference: {
      onDereference(schema: JSONSchema, path: string) {
        let set = map.get(schema)
        if (!set) {
          set = new Set()
          map.set(schema, set)
        }
        set.add(path)
      }
    }
  })
  return [result, map]
}
