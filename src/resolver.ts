import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {ExternallyReferenced, JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        dereferencedPaths.set(schema, $ref)
        // A $ref into a separate file (as opposed to a `#/...` pointer within
        // the current document) brings in a schema that keeps its own
        // `definitions`/`$defs` map, wherever it ends up nested once merged
        // into the referencing document. Mark its root so standaloneName()
        // can still find named definitions living inside it (see #143).
        if (!$ref.startsWith('#') && !Object.prototype.hasOwnProperty.call(schema, ExternallyReferenced)) {
          Object.defineProperty(schema, ExternallyReferenced, {
            enumerable: false,
            value: true,
            writable: false,
          })
        }
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema}
}
