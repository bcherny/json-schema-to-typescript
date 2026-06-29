export const input = {
  title: 'Enum',
  type: 'object',
  properties: {
    specialStringEnum: {
      type: 'string',
      enum: ['a', 'say "hi"', 'b-c'],
    },
  },
  required: ['specialStringEnum'],
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
