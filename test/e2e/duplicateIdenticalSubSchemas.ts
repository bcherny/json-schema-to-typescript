export const input = {
  title: 'DuplicateIdenticalSubSchemas',
  type: 'object',
  properties: {
    field1: {
      oneOf: [
        {
          title: 'Address',
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
          },
          required: ['street', 'city'],
        },
        {
          title: 'Contact',
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
          },
        },
      ],
    },
    field2: {
      anyOf: [
        {
          title: 'Address',
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
          },
          required: ['street', 'city'],
        },
        {
          title: 'Contact',
          type: 'object',
          properties: {
            phone: {
              type: 'string',
            },
          },
        },
      ],
    },
    field3: {
      allOf: [
        {
          title: 'Address',
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
          },
          required: ['street', 'city'],
        },
      ],
    },
  },
}
