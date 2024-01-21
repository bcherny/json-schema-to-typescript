export const input = {
  type: 'object',
  properties: {
    a: {type: 'string'},
    b: {type: 'string'},
    c: {type: 'string'},
  },
  allOf: [
    {required: ['a']},
    {
      oneOf: [{required: ['b']}, {required: ['c']}],
    },
  ],
  additionalProperties: false,
}
