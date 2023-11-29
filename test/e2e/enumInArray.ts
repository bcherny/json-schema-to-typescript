export const input = {
  type: 'object',
  properties: {
    foo: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['BAR', 'BAZ'],
        enumNames: ['bar', 'baz'],
        tsEnumNames: ['BAR', 'BAZ'],
      },
    },
    title: 'foo',
  },
}
