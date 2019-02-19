export const input = {
  title: 'WithNestedComment',
  type: 'object',
  properties: {
    a: {
      type: 'object',
      description: '/* comment */',
      properties: {
        b: {
          type: 'string',
          description: '/* nested comment */'
        }
      }
    }
  }
}
