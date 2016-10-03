import { CircularReferenceError } from '../../src/errors'
import { JSONSchema } from '../../src/JSONSchema'

export const schema: JSONSchema = {
  additionalProperties: false,
  properties: {
    foo: {
      $ref: '#/properties/foo'
    }
  },
  required: ['foo'],
  title: 'SelfReferential',
  type: 'object'
}

export const error = {
  type: CircularReferenceError
}
