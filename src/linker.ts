import {JSONSchema, Parent, LinkedJSONSchema} from './types/JSONSchema'
import {isPlainObject} from 'lodash'
import {JSONSchema4Type} from 'json-schema'

/**
 * Traverses over the schema, giving each node a reference to its
 * parent node. We need this for downstream operations.
 */
export function link(
  schema: JSONSchema4Type | JSONSchema,
  parent: JSONSchema4Type | null = null,
  processed = new Set<JSONSchema4Type | JSONSchema>()
): LinkedJSONSchema {
  if (!Array.isArray(schema) && !isPlainObject(schema)) {
    return schema as LinkedJSONSchema
  }

  // Handle cycles
  if (processed.has(schema)) {
    return schema as LinkedJSONSchema
  }
  processed.add(schema)

  // Add a reference to this schema's parent
  Object.defineProperty(schema, Parent, {
    enumerable: false,
    value: parent,
    writable: false
  })

  // Arrays
  if (Array.isArray(schema)) {
    schema.forEach(child => link(child, schema, processed))
  }

  // Objects
  for (const key in schema as JSONSchema) {
    link((schema as JSONSchema)[key], schema, processed)
  }

  return schema as LinkedJSONSchema
}
