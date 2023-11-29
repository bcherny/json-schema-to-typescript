export const input = {
  name: 'Array of schema',
  type: 'object',
  properties: {
    countries: {
      id: 'Countries',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            minLength: 2,
            maxLength: 2,
            pattern: '[A-Z]+',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'name'],
      },
    },
    tuple: {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
          },
        },
        {
          type: 'object',
          properties: {
            bar: {type: 'number'},
          },
        },
      ],
    },
  },
}
