import { CircularReferenceError } from '../../src/errors'
import { JSONSchema } from '../../src/JSONSchema'

export const schema: JSONSchema = {
  additionalProperties: false,
  properties: {
    bar: {
      $ref: '#/properties/foo'
    },
    foo: {
      $ref: '#/properties/bar'
    }
  },
  required: ['foo', 'bar'],
  title: 'CircularReference',
  type: 'object'
}

export const error = {
  type: CircularReferenceError
}
