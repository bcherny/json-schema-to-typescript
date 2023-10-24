export const input = {
  properties: {
    bar: {
      anyOf: [{type: 'string'}, {type: 'string'}, {type: 'integer'}, {type: 'string'}],
    },
    foo: {
      anyOf: [{type: 'string'}, {type: 'any'}, {type: 'integer'}],
    },
    fooBar: {
      anyOf: [{tsType: 'A'}, {tsType: 'A'}, {tsType: 'B'}, {tsType: 'A'}, {tsType: 'B'}],
    },
  },
  required: ['bar', 'foo', 'fooBar'],
  title: 'Optimizable Schema',
  type: 'object',
}
