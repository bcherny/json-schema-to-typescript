import {JSONSchema, Parent, LinkedJSONSchema} from './types/JSONSchema'
import {isPlainObject} from 'lodash'
import {JSONSchema4Type} from 'json-schema'

/**
 * Traverses over the schema, giving each node a reference to its
 * parent node. We need this for downstream operations.
 */
export function link(
  schema: JSONSchema4Type | JSONSchema,
  parent: LinkedJSONSchema | null = null,
  processed = new WeakSet<LinkedJSONSchema>()
): LinkedJSONSchema {
  const s = schema as LinkedJSONSchema
  if (Array.isArray(s) || isPlainObject(s)) {
    // Shared logic
    if (processed.has(s)) {
      return s
    }
    processed.add(s)
    Object.defineProperty(s, Parent, {
      enumerable: false,
      value: parent,
      writable: false
    })

    // Arrays
    if (Array.isArray(s)) {
      s.forEach(child => link(child, s, processed))
      return s
    }

    // Objects
    for (const key in s) {
      link(s[key], s, processed)
    }
    return s
  }
  return s
}
