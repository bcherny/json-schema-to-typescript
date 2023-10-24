export const input = {
  title: 'Enum',
  type: 'object',
  properties: {
    bar: {
      type: 'integer',
      enum: [1, 2, 3],
      tsEnumNames: ['One', 'Three'],
    },
  },
  required: ['bar'],
  additionalProperties: false,
}

export const options = {
  useTypescriptEnums: true,
}

export const error = true
