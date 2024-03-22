export const input = {
  title: 'Enum',
  type: 'object',
  definitions: {
    enumFromDefinition: {
      type: 'string',
      enum: ['a', 'b', 'c'],
    },
  },
  properties: {
    stringEnum: {
      type: 'string',
      enum: ['a', 'b', 'c'],
    },
    impliedStringEnum: {
      enum: ['a', 'b', 'c'],
    },
    booleanEnum: {
      type: 'boolean',
      enum: [true],
    },
    impliedBooleanEnum: {
      enum: [true],
    },
    integerEnum: {
      type: 'integer',
      enum: [-1, 0, 1],
    },
    impliedIntegerEnum: {
      enum: [-1, 0, 1],
    }
  },
  required: [
    'stringEnum',
    'impliedStringEnum',
    'booleanEnum',
    'impliedBooleanEnum',
    'integerEnum',
    'impliedIntegerEnum'
  ],
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true
}
