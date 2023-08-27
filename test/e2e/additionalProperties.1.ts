export const input = {
  title: 'AdditionalProperties',
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
  },
  additionalProperties: {
    type: 'number',
  },
}
