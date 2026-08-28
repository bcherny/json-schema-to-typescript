export const input = {
  title: 'DuplicateUnnamedEnumWithTitle',
  type: 'object',
  properties: {
    status1: {
      type: 'string',
      title: 'StatusType',
      enum: ['active', 'inactive'],
    },
    status2: {
      type: 'string',
      title: 'StatusType',
      enum: ['active', 'inactive'],
    },
  },
  additionalProperties: false,
}
