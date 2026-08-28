export const input = {
  title: 'NestedDuplicateSubSchemas',
  type: 'object',
  properties: {
    container1: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            title: 'Item',
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
            },
            required: ['id'],
          },
        },
      },
    },
    container2: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            title: 'Item',
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
            },
            required: ['id'],
          },
        },
      },
    },
    differentItem: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            title: 'Item',
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            },
            required: ['id'],
          },
        },
      },
    },
  },
}
