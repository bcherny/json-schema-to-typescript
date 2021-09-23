export const input = {
  type: 'object',
  required: ['a', 'b'],
  properties: {
    a: {
      type: 'string'
    },
    b: {
      type: 'string',
      tsReadonly: false
    },
    c: {
      type: 'string'
    },
    d: {
      type: 'string',
      tsReadonly: false
    }
  },
  additionalProperties: false,
  tsReadonly: true
}
