export const input = {
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
}
