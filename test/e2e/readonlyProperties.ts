import { Options } from '../../src/'

export const input = {
  title: 'ReadOnlyExample',
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    },
    bar: {
      type: 'number'
    }
  },
  required: ['foo', 'bar'],
  additionalProperties: false
}

export const options: Partial<Options> = {
  readOnlyProperties: true
}
