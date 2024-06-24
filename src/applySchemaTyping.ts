import {Intersection, Types, type LinkedJSONSchema} from './types/JSONSchema'
import {typesOfSchema} from './typesOfSchema'

export function applySchemaTyping(schema: LinkedJSONSchema) {
  const types = typesOfSchema(schema)

  Object.defineProperty(schema, Types, {
    enumerable: false,
    value: types,
    writable: false,
  })

  if (types.length > 1) {
    Object.defineProperty(schema, Intersection, {
      enumerable: false,
      value: {
        $id: schema.$id,
        allOf: [],
        description: schema.description,
        title: schema.title,
      },
      writable: false,
    })

    delete schema.$id
    delete schema.description
    delete schema.name
    delete schema.title
  }
}
