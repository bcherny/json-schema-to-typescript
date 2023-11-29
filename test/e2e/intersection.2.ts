export const input = {
  type: 'object',
  properties: {
    c: {
      type: 'string',
    },
    d: {
      type: 'string',
    },
  },
  patternProperties: {
    '^x-': {},
  },
  additionalProperties: false,
  required: ['c', 'd'],
  allOf: [
    {
      $ref: '#/definitions/A',
    },
    {
      $ref: '#/definitions/B',
    },
  ],
  definitions: {
    A: {
      type: 'object',
      properties: {
        a: {type: 'string'},
      },
    },
    B: {
      type: 'object',
      properties: {
        b: {type: 'string'},
      },
    },
  },
}
