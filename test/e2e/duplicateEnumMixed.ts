export const input = {
  title: 'DuplicateEnumMixed',
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
    priority: {
      type: 'string',
      title: 'Priority',
      enum: ['low', 'medium', 'high'],
      tsEnumNames: ['Low', 'Medium', 'High'],
    },
  },
  additionalProperties: false,
}
