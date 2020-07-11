import {isPlainObject} from 'lodash'
import {JSONSchema, SchemaType} from './types/JSONSchema'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export function typeOfSchema(schema: JSONSchema): SchemaType {
  if (schema.tsType) return 'CUSTOM_TYPE'
  if (schema.allOf) return 'ALL_OF'
  if (schema.anyOf) return 'ANY_OF'
  if (schema.oneOf) return 'ONE_OF'
  if (Array.isArray(schema.type)) return 'UNION'
  if (schema.type === 'null') return 'NULL'
  if (schema.enum && schema.tsEnumNames) return 'NAMED_ENUM'
  if (schema.enum) return 'UNNAMED_ENUM'
  if (schema.$ref) return 'REFERENCE'
  switch (schema.type) {
    case 'string':
      return 'STRING'
    case 'number':
      return 'NUMBER'
    case 'integer':
      return 'NUMBER'
    case 'boolean':
      return 'BOOLEAN'
    case 'object':
      if (!isPlainObject(schema.additionalProperties) && !schema.patternProperties && !schema.properties) {
        return 'UNNAMED_SCHEMA'
      }
      break
    case 'array':
      if (schema.items) return 'TYPED_ARRAY'
      return 'UNTYPED_ARRAY'
    case 'any':
      return 'ANY'
  }
  if (schema.items) return 'TYPED_ARRAY'

  switch (typeof schema.default) {
    case 'boolean':
      return 'BOOLEAN'
    case 'number':
      return 'NUMBER'
    case 'string':
      return 'STRING'
  }
  if (schema.id) return 'NAMED_SCHEMA'
  if (isPlainObject(schema) && Object.keys(schema).length) return 'UNNAMED_SCHEMA'
  return 'ANY'
}
