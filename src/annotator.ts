import {isPlainObject} from 'lodash'
import {AnnotatedJSONSchema, IsSchema, JSONSchema, Parent, isAnnotated} from './types/JSONSchema'
import {isSchemaLike} from './utils'

const annotators = new Set<(schema: JSONSchema, parent: JSONSchema | null) => void>()

annotators.add(function annotateParent(schema, parent) {
  Object.defineProperty(schema, Parent, {
    enumerable: false,
    value: parent,
    writable: false,
  })
})

annotators.add(function annotateSchemas(schema) {
  Object.defineProperty(schema, IsSchema, {
    enumerable: false,
    value: isSchemaLike(schema),
    writable: false,
  })
})

/**
 * Traverses over the schema, assigning to each
 * node metadata that will be used downstream.
 */
export function annotate(schema: JSONSchema): AnnotatedJSONSchema {
  function go(s: JSONSchema, parent: JSONSchema | null): void {
    if (!Array.isArray(s) && !isPlainObject(s)) {
      return
    }

    // Handle cycles
    if (isAnnotated(s)) {
      return
    }

    // Run annotators
    annotators.forEach(f => {
      f(s, parent)
    })

    // Handle arrays
    if (Array.isArray(s)) {
      s.forEach(_ => go(_, s))
    }

    // Handle objects
    for (const key in s) {
      go(s[key], s)
    }
  }

  go(schema, null)

  return schema as AnnotatedJSONSchema
}
