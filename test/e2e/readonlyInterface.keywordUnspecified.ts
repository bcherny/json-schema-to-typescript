export const input = {
  type: 'object',
  required: ['a', 'b'],
  properties: {
    a: {
      type: 'string',
      tsReadonlyProperty: true
    },
    b: {
      type: 'string'
    },
    c: {
      type: 'string',
      tsReadonlyProperty: true
    },
    d: {
      type: 'string'
    }
  },
  additionalProperties: false
}
