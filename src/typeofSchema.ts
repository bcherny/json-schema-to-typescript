import { JSONSchema } from './JSONSchema'
import { isPlainObject } from 'lodash'

export type SCHEMA_TYPE = 'ALL_OF' | 'UNNAMED_SCHEMA' | 'ANY' | 'ANY_OF' | 'BOOLEAN' | 'LITERAL' | 'NAMED_ENUM' | 'NAMED_SCHEMA' | 'NULL' | 'NUMBER' | 'STRING' | 'OBJECT' | 'TYPED_ARRAY' | 'REFERENCE' | 'UNION' | 'UNNAMED_ENUM' | 'UNTYPED_ARRAY'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export function typeOfSchema(schema: JSONSchema): SCHEMA_TYPE {
  console.log('typeOfSchema', schema)
  if (schema.allOf) return 'ALL_OF'
  if (schema.anyOf) return 'ANY_OF'
  if (schema.items) return 'TYPED_ARRAY'
  if (schema.enum && schema.tsEnumNames) return 'NAMED_ENUM'
  if (schema.enum) return 'UNNAMED_ENUM'
  if (schema.properties || schema.additionalProperties) return 'NAMED_SCHEMA'
  if (schema.$ref) return 'REFERENCE'
  if (Array.isArray(schema.type)) return 'UNION'
  switch (schema.type) {
    case 'string': return 'STRING'
    case 'number': return 'NUMBER'
    case 'integer': return 'NUMBER'
    case 'boolean': return 'BOOLEAN'
    case 'object': return 'OBJECT' // TODO: is this ok?
    case 'array': return 'UNTYPED_ARRAY'
    case 'null': return 'NULL'
    case 'any': return 'ANY'
  }
  if (!isPlainObject(schema)) return 'LITERAL'
  if (isPlainObject(schema)) return 'UNNAMED_SCHEMA'
  return 'ANY'
}
