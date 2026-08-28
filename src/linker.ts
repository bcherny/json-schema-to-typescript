import {JSONSchema, Parent, LinkedJSONSchema, Shared} from './types/JSONSchema'
import {isPlainObject} from 'lodash'
import {JSONSchema4Type} from 'json-schema'

/**
 * Traverses over the schema, giving each node a reference to its
 * parent node. We need this for downstream operations.
 */
export function link(schema: JSONSchema4Type | JSONSchema, parent: JSONSchema4Type | null = null): LinkedJSONSchema {
  if (!Array.isArray(schema) && !isPlainObject(schema)) {
    return schema as LinkedJSONSchema
  }

  // Handle cycles, and nodes shared any other way: keep the first parent, note that it's not the only one
  if ((schema as JSONSchema).hasOwnProperty(Parent)) {
    if ((schema as LinkedJSONSchema)[Parent] !== parent) {
      Object.defineProperty(schema, Shared, {enumerable: false, value: true, writable: false})
    }
    return schema as LinkedJSONSchema
  }

  // Add a reference to this schema's parent
  Object.defineProperty(schema, Parent, {
    enumerable: false,
    value: parent,
    writable: false,
  })

  // Arrays
  if (Array.isArray(schema)) {
    schema.forEach(child => link(child, schema))
  }

  // Objects
  for (const key in schema as JSONSchema) {
    link((schema as JSONSchema)[key], schema)
  }

  return schema as LinkedJSONSchema
}
