export const input = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    '`foo`': {
      type: 'string',
    },
    "'bar'": {
      type: 'string',
    },
    '"baz"': {
      type: 'string',
    },
    '$zoo 2': {
      type: 'string',
    },
    'qux...': {
      type: 'number',
    },
  },
  required: ['`foo`', "'bar'", '"baz"'],
}
