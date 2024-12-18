export const input = {
  title: 'Enum',
  type: 'object',
  properties: {
    specialStringEnum: {
      type: 'string',
      enum: ['text/plain', 'a', 'b-c', 'd.e'],
    },
  },
  required: ['specialStringEnum'],
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
