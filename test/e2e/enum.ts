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
    },
    numberEnum: {
      type: 'number',
      enum: [-1.1, 0, 1.2],
    },
    namedIntegerEnum: {
      type: 'integer',
      enum: [1, 2, 3],
      tsEnumNames: ['One', 'Two', 'Three'],
    },
    impliedNamedIntegerEnum: {
      enum: [4, 5, 6],
      tsEnumNames: ['Four', 'Five', 'Six'],
    },
    impliedHeterogeneousEnum: {
      enum: [-20.1, null, 'foo', false],
    },
    namedIntegerEnumTitle: {
      type: 'integer',
      enum: [1, 2, 3],
      title: 'NamedInteger',
      tsEnumNames: ['One', 'Two', 'Three'],
    },
    impliedNamedIntegerEnumTitle: {
      enum: [4, 5, 6],
      title: 'ImpliedNamedInteger',
      tsEnumNames: ['Four', 'Five', 'Six'],
    },
    enumThatComesFromADefinition: {
      $ref: '#/definitions/enumFromDefinition',
    },
    propertyWithAnEnum: {
      type: 'object',
      properties: {
        enumThatComesFromADefinition: {
          $ref: '#/definitions/enumFromDefinition',
        },
      },
    },
  },
  required: [
    'stringEnum',
    'impliedStringEnum',
    'booleanEnum',
    'impliedBooleanEnum',
    'integerEnum',
    'impliedIntegerEnum',
    'impliedNamedIntegerEnum',
    'namedIntegerEnumTitle',
    'impliedNamedIntegerEnumTitle',
  ],
  additionalProperties: false,
}
