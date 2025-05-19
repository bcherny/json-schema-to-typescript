export const input = {
  title: 'NumericEnum',
  type: 'object',
  properties: {
    numericKeysEnum: {
      type: 'string',
      enum: ['0bar', '1baz', '2foo']
    },
    numericValueEnum: {
      type: 'number',
      enum: [10, 20, 30]
    },
    mixedKeysEnum: {
      type: 'string',
      enum: ['abc', '0abc', '1def']
    }
  },
  required: [
    'numericKeysEnum',
    'numericValueEnum',
    'mixedKeysEnum'
  ],
  additionalProperties: false
}