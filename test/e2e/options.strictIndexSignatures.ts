export const input = {
  title: 'StrictIndexSignatures',
  type: 'object',
  properties: {
    maybe: {
      type: 'string',
    },
    complex: {
      type: 'object',
      properties: {
        maybe: {
          type: 'string',
        },
      },
      additionalProperties: {
        title: 'Leaf',
        type: 'object',
        properties: {
          maybe: {
            type: 'string',
          },
        },
      },
    },
  },
  additionalProperties: {
    type: 'string',
  },
}

export const options = {
  strictIndexSignatures: true,
}
