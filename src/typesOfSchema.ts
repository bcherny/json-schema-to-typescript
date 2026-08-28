import {isPlainObject} from 'lodash'
import {Intersection, isCompound, JSONSchema, LinkedJSONSchema, Parent, SchemaType, Types} from './types/JSONSchema'

// Keywords that only annotate a schema (eg. for documentation) without constraining
// the values it matches. A schema made up of nothing but these keywords doesn't
// restrict its type any more than the empty schema does.
const ANNOTATION_ONLY_KEYWORDS = ['description', 'title', 'deprecated']

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

/**
 * Whether any matcher recognizes the schema. One that none does has no way to be
 * typed on its own: it only gets the `UNNAMED_SCHEMA` default.
 */
export function hasOwnType(schema: JSONSchema): boolean {
  return Boolean(schema.tsType) || Object.values(matchers).some(f => f(schema))
}

/**
 * Works out the schema's types (see `typesOfSchema`) once, ahead of parsing, and records them
 * on it as `[Types]`. A schema that is several types at once is emitted as their intersection:
 * it gets a companion `ALL_OF` schema, `[Intersection]`, that takes over its `allOf` (if any)
 * and its `$id`, `title`, `description` and `name`, so that the name and comment land on the
 * intersection rather than on each member; the parser adds one member per type to it. It is
 * built here rather than in the parser because the parser caches ASTs by schema object, so the
 * intersection has to be one object, not a new one per visit.
 *
 * Mutates `schema`.
 */
export function applySchemaTyping(schema: LinkedJSONSchema): void {
  const types = typesOfSchema(schema)
  Object.defineProperty(schema, Types, {enumerable: false, value: types, writable: false})
  if (types.size === 1) {
    return
  }

  const intersection = {
    [Parent]: schema,
    [Types]: new Set(['ALL_OF']),
    $id: schema.$id,
    description: schema.description,
    name: schema.name,
    title: schema.title,
    allOf: schema.allOf ?? [],
    required: [],
    additionalProperties: false,
  }
  types.delete('ALL_OF')
  delete schema.allOf
  delete schema.$id
  delete schema.description
  delete schema.name
  delete schema.title
  Object.defineProperty(schema, Intersection, {enumerable: false, value: intersection, writable: false})
}

const matchers: Record<Exclude<SchemaType, 'CUSTOM_TYPE'>, (schema: JSONSchema) => boolean> = {
  ALL_OF(schema) {
    return 'allOf' in schema
  },
  ANY(schema) {
    if (Object.keys(schema).every(key => ANNOTATION_ONLY_KEYWORDS.includes(key))) {
      // The empty schema {} validates any value, and a schema made up of only
      // annotation keywords (eg. `description`) is no more constrained than that.
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
  NAMED_ENUM(schema) {
    return 'enum' in schema && 'tsEnumNames' in schema
  },
  NAMED_SCHEMA(schema) {
    // 8.2.1. The presence of "$id" in a subschema indicates that the subschema constitutes a distinct schema resource within a single schema document.
    // Guarded against an array `type` (narrower than the guard on UNNAMED_SCHEMA
    // below, on purpose): such a schema is a `UNION`, whose members are re-parsed
    // one `type` at a time with the `properties` still attached (see the `UNION`
    // case in `parser.ts`), so also matching here would intersect the object shape
    // with that union and make its non-object members unreachable.
    return '$id' in schema && !Array.isArray(schema.type) && ('patternProperties' in schema || 'properties' in schema)
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
