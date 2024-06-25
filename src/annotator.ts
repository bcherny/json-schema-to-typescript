import {isPlainObject} from 'lodash'
import {DereferencedPaths} from './resolver'
import {AnnotatedJSONSchema, JSONSchema, Parent, isAnnotated} from './types/JSONSchema'

/**
 * Traverses over the schema, assigning to each
 * node metadata that will be used downstream.
 */
export function annotate(
  schema: JSONSchema,
  dereferencedPaths: DereferencedPaths,
  parent: JSONSchema | null = null,
): AnnotatedJSONSchema {
  if (!Array.isArray(schema) && !isPlainObject(schema)) {
    return schema as AnnotatedJSONSchema
  }

  // Handle cycles
  if (isAnnotated(schema)) {
    return schema
  }

  // Add a reference to this schema's parent
  Object.defineProperty(schema, Parent, {
    enumerable: false,
    value: parent,
    writable: false,
  })

  // Arrays
  if (Array.isArray(schema)) {
    schema.forEach(child => annotate(child, dereferencedPaths, schema))
  }

  // Objects
  for (const key in schema) {
    annotate(schema[key], dereferencedPaths, schema)
  }

  return schema as AnnotatedJSONSchema
}
