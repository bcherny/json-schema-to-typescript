export const input = {
  type: 'object',
  required: ['a', 'b'],
  properties: {
    a: {
      type: 'string',
      tsReadonly: true
    },
    b: {
      type: 'string',
      tsReadonly: false
    },
    c: {
      type: 'string',
      tsReadonly: true
    },
    d: {
      type: 'string',
      tsReadonly: false
    }
  },
  additionalProperties: {},
  tsReadonly: false
}

export const options = {
  readonlyByDefault: true,
  readonlyKeyword: true
}
