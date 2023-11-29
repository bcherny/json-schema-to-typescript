export const input = {
  title: 'AdditionalProperties (configured to default to false)',
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

export const options = {
  additionalProperties: false,
}
