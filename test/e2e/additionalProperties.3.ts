export const input = {
  title: 'AdditionalProperties (default to true)',
  type: 'object',
  definitions: {
    e: {
      type: 'object',
    },
  },
  properties: {
    a: {
      type: 'object',
    },
    b: {
      type: 'object',
      additionalProperties: false,
    },
    c: {
      type: 'object',
      additionalProperties: true,
    },
    d: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
    },
    e: {
      $ref: '#/definitions/e',
    },
  },
}
