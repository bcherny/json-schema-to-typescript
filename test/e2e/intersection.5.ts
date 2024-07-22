export const input = {
  type: 'object',
  oneOf: [{$ref: '#/definitions/A'}, {$ref: '#/definitions/B'}],
  definitions: {
    A: {
      type: 'object',
      allOf: [
        {$ref: '#/definitions/Base'},
        {
          properties: {
            b: {$ref: '#/definitions/B'},
          },
        },
      ],
      additionalProperties: false,
    },
    B: {
      type: 'object',
      allOf: [
        {$ref: '#/definitions/Base'},
        {
          properties: {
            x: {type: 'string'},
          },
        },
      ],
      additionalProperties: false,
    },
    Base: {
      type: 'object',
      properties: {
        y: {type: 'string'},
      },
      additionalProperties: false,
    },
  },
}
