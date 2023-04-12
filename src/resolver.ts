import $RefParser = require('@bcherny/json-schema-ref-parser')
import {JSONSchema, JSONSchemaType} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<$RefParser.JSONSchemaObject, string>
export type RefMap = Map<string, JSONSchemaType>

export const ReferencedSchemas = Symbol('ReferencedSchemas')

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefParser.Options}
): Promise<{
  dereferencedPaths: DereferencedPaths
  dereferencedSchema: JSONSchema
  refMap: RefMap
}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const resolver = await parser.resolve(cwd, schema, $refOptions)

  const seenRefs: string[] = []
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref, schema) {
        dereferencedPaths.set(schema, $ref)
        seenRefs.push($ref)
      }
    }
  })) as JSONSchema // TODO: fix types

  const refMap: RefMap = new Map()
  for (const $ref of seenRefs) {
    const resolvedRef = resolver.get($ref)
    if (resolvedRef) {
      refMap.set($ref, resolvedRef as JSONSchemaType)
    }
  }

  return {dereferencedPaths, dereferencedSchema, refMap}
}
