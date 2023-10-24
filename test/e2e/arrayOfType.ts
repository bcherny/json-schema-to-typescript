export const input = {
  title: 'Array of type',
  type: 'object',
  properties: {
    foo: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    bar: {
      items: {
        type: 'string',
      },
      type: ['array'],
    },
    baz: {
      items: {
        type: ['string', 'number'],
      },
      type: ['array'],
    },
    moo: {
      items: [{type: 'integer'}, {type: 'string'}],
    },
  },
}
