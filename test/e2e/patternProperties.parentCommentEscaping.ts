export const input = {
  type: 'object',
  properties: {
    '*/parent*/': {
      type: 'object',
      patternProperties: {
        '^x-': {type: 'string'},
      },
      additionalProperties: false,
    },
  },
}
