export const input = {
  title: 'WithNestedComment',
  type: 'object',
  definitions: {
    a: { type: 'string' },
    b: {
      type: 'number',
      description: '/* I am a comment */',
      properties: {
        description: {
          type: 'string',
          description: '/* Nested comment */'
        }
      }
    }
  },
  properties: {
    c: {
      items: [{ $ref: '#/definitions/a' }, { $ref: '#/definitions/b' }],
      type: 'array'
    }
  }
}
