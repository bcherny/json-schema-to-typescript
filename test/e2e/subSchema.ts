export const input = {
  title: 'Schema with Subschema',
  properties: {
    firstName: {
      type: 'string',
    },
    friend: {
      properties: {
        knowsFrom: {
          enum: ['work', 'school', 'other'],
        },
      },
      required: ['knowsFrom'],
    },
    coworker: {
      properties: {
        company: {
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
          additionalProperties: false,
        },
      },
      additionalProperties: {
        enum: [10, 20, 30],
        tsEnumNames: ['red', 'green', 'blue'],
      },
    },
  },
  required: ['firstName'],
}
