export const input = {
  type: 'object',
  required: ['a', 'b'],
  properties: {
    a: {
      type: 'string'
    },
    b: {
      type: 'string',
      tsReadonlyProperty: false
    },
    c: {
      type: 'string'
    },
    d: {
      type: 'string',
      tsReadonlyProperty: false
    }
  },
  additionalProperties: {},
  tsReadonlyPropertyDefaultValue: true
}

export const options = {
  readonlyByDefault: true
}
