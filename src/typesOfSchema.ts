import {isPlainObject} from 'lodash'
import {isCompound, JSONSchema, SchemaType} from './types/JSONSchema'

/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 *
 * Due to what some might say is an oversight in the JSON-Schema spec, a given schema may
 * implicitly be an *intersection* of multiple JSON-Schema directives (ie. multiple TypeScript
 * types). The spec leaves it up to implementations to decide what to do with this
 * loosely-defined behavior.
 */
export function typesOfSchema(schema: JSONSchema): Set<SchemaType> {
  // tsType is an escape hatch that supercedes all other directives
  if (schema.tsType) {
    return new Set(['CUSTOM_TYPE'])
  }

  // Collect matched types
  const matchedTypes = new Set<SchemaType>()
  for (const [schemaType, f] of Object.entries(matchers)) {
    if (f(schema)) {
      matchedTypes.add(schemaType as SchemaType)
    }
  }

  // Default to an unnamed schema
  if (!matchedTypes.size) {
    matchedTypes.add('UNNAMED_SCHEMA')
  }

  return matchedTypes
}

const matchers: Record<SchemaType, (schema: JSONSchema) => boolean> = {
  ALL_OF(schema) {
    return 'allOf' in schema
  },
  ANY(schema) {
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
    if (schema.type === 'boolean') {
      return true
    }
    // Only infer BOOLEAN from `default` when `type` isn't declared as
    // something else; an explicit `type` always takes precedence over the
    // type of `default` (see #434).
    if (schema.type === undefined && !isCompound(schema) && typeof schema.default === 'boolean') {
      return true
    }
    return false
  },
  CUSTOM_TYPE() {
    return false // Explicitly handled before we try to match
  },
  NAMED_ENUM(schema) {
    return 'enum' in schema && 'tsEnumNames' in schema
  },
  NAMED_SCHEMA(schema) {
    // 8.2.1. The presence of "$id" in a subschema indicates that the subschema constitutes a distinct schema resource within a single schema document.
    return '$id' in schema && ('patternProperties' in schema || 'properties' in schema)
  },
  NEVER(schema: JSONSchema | boolean) {
    return schema === false
  },
  NULL(schema) {
    // `type: null` isn't valid JSON-Schema (`type` must be a string or an
    // array of strings), but it's an easy mistake to make (eg. an unquoted
    // `null` in YAML), and the most plausible intent is `type: "null"`.
    return schema.type === 'null' || schema.type === null
  },
  NUMBER(schema) {
    if ('enum' in schema) {
      return false
    }
    if (schema.type === 'integer' || schema.type === 'number') {
      return true
    }
    // Only infer NUMBER from `default` when `type` isn't declared as
    // something else; an explicit `type` always takes precedence over the
    // type of `default` (see #434).
    if (schema.type === undefined && !isCompound(schema) && typeof schema.default === 'number') {
      return true
    }
    return false
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
    if (schema.type === 'string') {
      return true
    }
    // Only infer STRING from `default` when `type` isn't declared as
    // something else; an explicit `type` always takes precedence over the
    // type of `default` (see #434).
    if (schema.type === undefined && !isCompound(schema) && typeof schema.default === 'string') {
      return true
    }
    return false
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
  UNNAMED_SCHEMA(schema) {
    // Mirrors NAMED_SCHEMA above: a schema's own `properties`/`patternProperties`
    // are a real type even without a `$id`, so they get intersected with any
    // sibling `allOf`/`anyOf`/`oneOf` instead of being silently dropped. Guarded
    // to schemas that are objects (or untyped) so it doesn't fire on a `UNION`
    // member that was assigned a non-object `type` but still carries the
    // parent's `properties` (see the `UNION` case in `parser.ts`). Schemas that
    // don't otherwise match anything still fall through to the default case at
    // the bottom of `typesOfSchema`.
    return (
      (schema.type === undefined || schema.type === 'object') &&
      !('$id' in schema) &&
      ('patternProperties' in schema || 'properties' in schema)
    )
  },
  UNTYPED_ARRAY(schema) {
    return schema.type === 'array' && !('items' in schema)
  },
}
