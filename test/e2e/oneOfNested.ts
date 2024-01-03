export const input = {
  type: 'object',
  $schema: 'http://json-schema.org/draft-07/schema',
  properties: {
    things: {
      type: 'array',
      minLength: 1,
      items: {
        type: 'object',
        required: ['thingProp'],
        oneOf: [
          {
            type: 'object',
            properties: {
              propOption1: {
                type: 'string',
              },
            },
            required: ['propOption1'],
          },
          {
            type: 'object',
            properties: {
              propOption2: {
                type: 'number',
              },
            },
            required: ['propOption2'],
          },
        ],
        properties: {
          thingProp: {
            type: 'string',
          },
        },
      },
    },
  },
}
