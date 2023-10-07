export const input = {
  type: 'object',
  properties: {
    input: {
      type: ['string', 'object', 'array'],
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
}
