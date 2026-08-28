// Same as arrayOfBoundedArrays, but with the bounded array nested under an object
// property (maxItems only, and minItems + maxItems) and as an allOf member, where
// the union of tuples must also be parenthesized before `&` is applied.
export const input = {
  title: 'Nested',
  type: 'object',
  properties: {
    grid: {
      type: 'array',
      items: {type: 'array', maxItems: 2, items: {type: 'string'}},
    },
    rows: {
      type: 'array',
      items: {type: 'array', minItems: 1, maxItems: 3, items: {type: 'string'}},
    },
    tagged: {
      allOf: [
        {type: 'array', maxItems: 2, items: {type: 'string'}},
        {type: 'array', items: {enum: ['a', 'b']}},
      ],
    },
  },
  additionalProperties: false,
}
