export const input = {
  title: 'WithComment',
  type: 'object',
  properties: {
    a: {
      type: 'object',
      description: '/* comment */',
      properties: {
        b: {
          type: 'string',
          description: '/* nested comment */',
        },
      },
    },
  },
}
