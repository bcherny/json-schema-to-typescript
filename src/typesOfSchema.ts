import {isPlainObject, memoize} from 'lodash'
import {SchemaType, LinkedJSONSchema, Parent} from './types/JSONSchema'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export function typesOfSchema(schema: LinkedJSONSchema): readonly SchemaType[] {
  const matchedTypes = typesOfSchemaFromMatchers(schema)

  if (matchedTypes.length) {
    return matchedTypes
  }

  if (!SCHEMAISH_FIELDS.some(_ => is(schema, _))) {
    return []
  }

  // Default to an unnamed schema
  return ['UNNAMED_SCHEMA']
}

/**
 * Fields whose properties can be JSON Schemas
 */
const SCHEMAISH_FIELDS: readonly (keyof LinkedJSONSchema)[] = [
  'pattern',
  'additionalItems',
  'items',
  'uniqueItems',
  'required',
  'additionalProperties',
  'definitions',
  'properties',
  'patternProperties',
  'dependencies',
  'enum',
  'not'
]

const typesOfSchemaFromMatchers = memoize((schema: LinkedJSONSchema): readonly SchemaType[] => {
  // tsType is an escape hatch that supercedes all other directives
  if (schema.tsType) {
    return ['CUSTOM_TYPE']
  }

  // Collect matched types
  const matchedTypes: SchemaType[] = []
  for (const [schemaType, f] of Object.entries(matchers)) {
    if (f(schema)) {
      matchedTypes.push(schemaType as SchemaType)
    }
  }

  return matchedTypes
})

function is(schema: LinkedJSONSchema, key: keyof LinkedJSONSchema): boolean {
  const matchedTypes = typesOfSchemaFromMatchers(schema)
  if (matchedTypes.length) {
    return false
  }
  return schema[Parent]?.[key] === schema
}

const matchers: Record<SchemaType, (schema: LinkedJSONSchema) => boolean> = {
  ALL_OF(schema) {
    return 'allOf' in schema
  },
  ANY(schema) {
    if (!schema[Parent]) {
      // If this is the root schema, generate an empty object rather than `unknown`
      return false
    }
    if (Object.keys(schema).length === 0) {
      // The empty schema {} validates any value
      // @see https://json-schema.org/draft-07/json-schema-core.html#rfc.section.4.3.1
      return true
    }
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
  CUSTOM_TYPE() {
    return false // Explicitly handled before we try to match
  },
  NAMED_ENUM(schema) {
    return 'enum' in schema && 'tsEnumNames' in schema
  },
  NAMED_SCHEMA(schema) {
    return (
      'id' in schema &&
      schema.type === 'object' &&
      ('patternProperties' in schema || 'properties' in schema || 'required' in schema)
    )
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
      !schema.properties &&
      !schema.required
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
    if (schema.type && schema.type !== 'array') {
      return false
    }
    return 'items' in schema
  },
  UNION(schema) {
    return Array.isArray(schema.type)
  },
  UNNAMED_ENUM(schema) {
    if ('tsEnumNames' in schema) {
      return false
    }
    if (
      schema.type &&
      schema.type !== 'boolean' &&
      schema.type !== 'integer' &&
      schema.type !== 'number' &&
      schema.type !== 'string'
    ) {
      return false
    }
    return 'enum' in schema
  },
  UNNAMED_SCHEMA() {
    return false // Explicitly handled as the default case
  },
  UNTYPED_ARRAY(schema) {
    return schema.type === 'array' && !('items' in schema)
  }
}
