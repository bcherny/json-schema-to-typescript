export const input = {
  title: 'Enum',
  type: 'object',
  properties: {
    bar: {
      type: 'integer',
      enum: [1, 2, 3],
      tsEnumNames: ['One', 2, 'Three'],
    },
  },
  required: ['bar'],
  additionalProperties: false,
}

export const error = true
