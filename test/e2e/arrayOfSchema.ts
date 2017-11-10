export const input = {
  id: 'Countries',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        minLength: 2,
        maxLength: 2,
        pattern: '[A-Z]+'
      },
      name: {
        type: 'string'
      }
    },
    required: ['id', 'name']
  }
}
