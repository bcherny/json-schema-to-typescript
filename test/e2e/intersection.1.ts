export const input = {
  type: 'object',
  additionalProperties: false,
  properties: {
    a: {
      additionalProperties: false,
      id: 'a',
      properties: {a: {type: 'string'}},
      required: ['a'],
    },
    b: {
      additionalProperties: false,
      id: 'b',
      properties: {b: {type: 'string'}},
      required: ['b'],
    },
  },
  oneOf: [
    {
      additionalProperties: false,
      id: 'c',
      properties: {c: {type: 'string'}},
      required: ['c'],
    },
    {
      additionalProperties: false,
      id: 'd',
      properties: {d: {type: 'string'}},
      required: ['d'],
    },
  ],
  required: ['a', 'b'],
}
