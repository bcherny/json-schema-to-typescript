import {isPlainObject} from 'lodash'
import {JSONSchema, SchemaType} from './types/JSONSchema'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export function typesOfSchema(schema: JSONSchema): readonly [SchemaType, ...SchemaType[]] {
  // Collect matched types
  const matchedTypes: SchemaType[] = []
  for (const [schemaType, f] of Object.entries(matchers)) {
    if (f(schema)) {
      matchedTypes.push(schemaType as SchemaType)
    }
  }

  // Default to an unnamed schema
  if (!matchedTypes.length) {
    return ['UNNAMED_SCHEMA']
  }

  return matchedTypes as [SchemaType, ...SchemaType[]]
}

const matchers: Record<SchemaType, (schema: JSONSchema) => boolean> = {
  ALL_OF(schema) {
    return 'allOf' in schema
  },
  ANY(schema) {
    return schema.type === 'any'
  },
  ANY_OF(schema) {
    return 'anyOf' in schema
  },
  BOOLEAN(schema) {
    if ('enum' in schema) {
      return false
    }
    return schema.type === 'boolean' || typeof schema.default === 'boolean'
  },
  CUSTOM_TYPE(schema) {
    return 'tsType' in schema
  },
  NAMED_ENUM(schema) {
    return 'enum' in schema && 'tsEnumNames' in schema
  },
  NAMED_SCHEMA(schema) {
    return 'id' in schema && !schema.allOf && !schema.anyOf && !schema.oneOf && schema.type === 'object'
  },
  NULL(schema) {
    return schema.type === 'null'
  },
  NUMBER(schema) {
    if ('enum' in schema) {
      return false
    }
    return schema.type === 'integer' || schema.type === 'number' || typeof schema.default === 'number'
  },
  OBJECT(schema) {
    return (
      schema.type === 'object' &&
      !isPlainObject(schema.additionalProperties) &&
      !schema.allOf &&
      !schema.anyOf &&
      !schema.oneOf &&
      !schema.patternProperties &&
      !schema.properties
    )
  },
  ONE_OF(schema) {
    return 'oneOf' in schema
  },
  REFERENCE(schema) {
    return '$ref' in schema
  },
  STRING(schema) {
    if ('enum' in schema) {
      return false
    }
    return schema.type === 'string' || typeof schema.default === 'string'
  },
  TYPED_ARRAY(schema) {
    return schema.type === 'array' && 'items' in schema
  },
  UNION(schema) {
    return Array.isArray(schema.type)
  },
  UNNAMED_ENUM(schema) {
    return 'enum' in schema && !('tsEnumNames' in schema)
  },
  UNNAMED_SCHEMA() {
    return false // Explicitly handled as the default case
  },
  UNTYPED_ARRAY(schema) {
    return schema.type === 'array' && !('items' in schema)
  }
}
