export const input = {
  title: 'DuplicateEnumWithoutTitle',
  type: 'object',
  properties: {
    obj1: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          tsEnumNames: ['Active', 'Inactive'],
        },
      },
      additionalProperties: false,
    },
    obj2: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          tsEnumNames: ['Active', 'Inactive'],
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}
