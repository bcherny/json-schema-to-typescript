export const input = {
  type: 'object',
  properties: {
    process_types: {
      type: 'object',
      patternProperties: {
        '^[-\\w]{1,128}$': {type: 'string'},
      },
      additionalProperties: false,
    },
  },
}
