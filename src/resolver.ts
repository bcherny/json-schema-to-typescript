import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {isPlainObject} from 'lodash'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

// JSON Schema 2019-09 allows annotation siblings next to `$ref`. When such
// siblings are present, json-schema-ref-parser produces a fresh merged object
// for the `$ref`, which breaks the referential equality the parser relies on
// to emit a named reference instead of inlining the target type. By wrapping
// the `$ref` in a single-member `allOf` before dereferencing, the dereferenced
// pointer keeps its identity and the annotations remain on the wrapper, where
// they can attach as a property-level JSDoc comment.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/363
const ANNOTATION_KEYS: ReadonlySet<string> = new Set([
  'title',
  'description',
  'default',
  'examples',
  'readOnly',
  'writeOnly',
  'deprecated',
  '$comment',
])

function liftAnnotationSiblingsOfRef(schema: unknown, processed = new WeakSet<object>()): void {
  if (Array.isArray(schema)) {
    for (const item of schema) {
      liftAnnotationSiblingsOfRef(item, processed)
    }
    return
  }
  if (!isPlainObject(schema)) {
    return
  }
  const obj = schema as Record<string, unknown>
  if (processed.has(obj)) {
    return
  }
  processed.add(obj)

  if (typeof obj.$ref === 'string') {
    const siblingKeys = Object.keys(obj).filter(k => k !== '$ref')
    if (siblingKeys.length > 0 && siblingKeys.every(k => ANNOTATION_KEYS.has(k))) {
      const $ref = obj.$ref
      delete obj.$ref
      obj.allOf = [{$ref}]
    }
  }

  for (const key of Object.keys(obj)) {
    liftAnnotationSiblingsOfRef(obj[key], processed)
  }
}

// json-schema-ref-parser parses external files via pluggable parsers. Wrap
// the JSON and YAML parsers so the lift transform also applies to schemas
// loaded from disk or HTTP — without it, sibling-annotated $refs in external
// files would still be merged.
function makeLiftingParser(basePlugin: any) {
  return {
    ...basePlugin,
    order: typeof basePlugin.order === 'number' ? basePlugin.order - 1 : 50,
    async parse(file: any) {
      const data = await basePlugin.parse.call(this, file)
      if (data && typeof data === 'object') {
        liftAnnotationSiblingsOfRef(data)
      }
      return data
    },
  }
}

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  liftAnnotationSiblingsOfRef(schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const {default: jsonParser} = await import('@apidevtools/json-schema-ref-parser/dist/lib/parsers/json.js')
  const {default: yamlParser} = await import('@apidevtools/json-schema-ref-parser/dist/lib/parsers/yaml.js')
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    parse: {
      ...$refOptions.parse,
      json: makeLiftingParser(jsonParser),
      yaml: makeLiftingParser(yamlParser),
    },
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        dereferencedPaths.set(schema, $ref)
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema}
}
