export const input = {
  definitions: {
    definitions: {
      type: 'integer',
    },
    properties: {
      type: 'string',
    },
  },
  properties: {
    additionalProperties: {
      items: {
        type: 'number',
      },
      type: 'array',
    },
    definitions: {
      type: 'number',
    },
    properties: {
      type: 'boolean',
    },
  },
  type: 'object',
}
