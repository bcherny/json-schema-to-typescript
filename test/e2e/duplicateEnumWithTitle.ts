export const input = {
  title: 'DuplicateEnumWithTitle',
  type: 'object',
  properties: {
    status1: {
      type: 'string',
      title: 'Status',
      enum: ['active', 'inactive'],
      tsEnumNames: ['Active', 'Inactive'],
    },
    status2: {
      type: 'string',
      title: 'Status',
      enum: ['active', 'inactive'],
      tsEnumNames: ['Active', 'Inactive'],
    },
  },
  additionalProperties: false,
}
