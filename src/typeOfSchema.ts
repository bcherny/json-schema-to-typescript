import {isPlainObject} from 'lodash'
import {JSONSchema, SCHEMA_TYPE} from './types/JSONSchema'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export function typeOfSchema(schema: JSONSchema): SCHEMA_TYPE {
  if (schema.tsType) return 'CUSTOM_TYPE'
  if (schema.allOf) return 'ALL_OF'
  if (schema.anyOf) return 'ANY_OF'
  if (schema.oneOf) return 'ONE_OF'
  if (Array.isArray(schema.type)) return 'UNION'
  if (schema.type === 'null') return 'NULL'
  if (schema.items) return 'TYPED_ARRAY'
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
      if (!schema.properties && !isPlainObject(schema)) {
        return 'OBJECT'
      }
      break
    case 'array':
      return 'UNTYPED_ARRAY'
    case 'any':
      return 'ANY'
  }

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
