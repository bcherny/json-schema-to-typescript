import { isPlainObject } from 'lodash'
import { JSONSchema, SCHEMA_TYPE } from './types/JSONSchema'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export function typeOfSchema(schema: JSONSchema): SCHEMA_TYPE {
  const oldJudgement = typeOfSchemaOld(schema)
  const newJudgement = typeOfSchemaNew(schema)
  if (newJudgement !== oldJudgement) {
    console.warn(newJudgement, oldJudgement, typeof schema)
    console.log(schema)
  }
  return oldJudgement
}

function typeOfSchemaOld(schema: JSONSchema): SCHEMA_TYPE {
  if (schema.allOf) return 'ALL_OF'
  if (schema.anyOf) return 'ANY_OF'
  if (schema.oneOf) return 'ONE_OF'
  if (schema.items) return 'TYPED_ARRAY'
  if (schema.enum && schema.tsEnumNames) return 'NAMED_ENUM'
  if (schema.enum) return 'UNNAMED_ENUM'
  if (schema.$ref) return 'REFERENCE'
  if (Array.isArray(schema.type)) return 'UNION'
  switch (schema.type) {
    case 'string': return 'STRING'
    case 'number': return 'NUMBER'
    case 'integer': return 'NUMBER'
    case 'boolean': return 'BOOLEAN'
    case 'object':
      if (!schema.properties && !isPlainObject(schema)) {
        return 'OBJECT'
      }
      break
    case 'array': return 'UNTYPED_ARRAY'
    case 'null': return 'NULL'
    case 'any': return 'ANY'
  }

  switch (typeof schema.default) {
    case 'boolean': return 'BOOLEAN'
    case 'number': return 'NUMBER'
    case 'string': return 'STRING'
  }
  if (schema.id) return 'NAMED_SCHEMA'
  if (isPlainObject(schema) && Object.keys(schema).length) return 'UNNAMED_SCHEMA'
  return 'ANY'
}

type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U }
  ? U
  : never
type Strings<T> = Exclude<T, Exclude<T, string>>

type SchemaIdentifier = (schema: JSONSchema) => SCHEMA_TYPE
const propertyMap: [KnownKeys<JSONSchema>, SCHEMA_TYPE | SchemaIdentifier][] = [
  ['allOf', 'ALL_OF'],
  ['anyOf', 'ANY_OF'],
  ['oneOf', 'ONE_OF'],
  ['items', 'TYPED_ARRAY'],
  [
    'enum',
    schema =>
      schema.hasOwnProperty('tsEnumNames') ? 'NAMED_ENUM' : 'UNNAMED_ENUM'
  ],
  ['$ref', 'REFERENCE']
]

const defaultMap: Record<string, SCHEMA_TYPE | undefined> = {
  boolean: 'BOOLEAN',
  number: 'NUMBER',
  string: 'STRING'
}
const anyMoreProps: SchemaIdentifier = schema =>
  !schema.properties && !isPlainObject(schema)
    ? 'OBJECT'
    : defaultMap[typeof schema.default] ||
      (schema.id
        ? 'NAMED_SCHEMA'
        : isPlainObject(schema) && Object.keys(schema).length
          ? 'UNNAMED_SCHEMA'
          : 'ANY')

const typeLookup: Record<
  Strings<JSONSchema['type']>,
  SCHEMA_TYPE | SchemaIdentifier
> = {
  string: 'STRING',
  number: 'NUMBER',
  integer: 'NUMBER',
  boolean: 'BOOLEAN',
  object: anyMoreProps,
  array: 'UNTYPED_ARRAY',
  null: 'NULL',
  any: 'ANY'
}

const typeOfSchemaNew = (schema: JSONSchema): SCHEMA_TYPE => {
  const firstPropertyMatched = propertyMap.find(([key]) =>
    schema.hasOwnProperty(key)
  )
  const val = firstPropertyMatched
    ? firstPropertyMatched[1]
    : schema.hasOwnProperty('type') && schema.type
      ? Array.isArray(schema.type)
        ? 'UNION'
        : typeLookup[schema.type]
      : anyMoreProps
  return typeof val === 'string' ? val : val(schema)
}
