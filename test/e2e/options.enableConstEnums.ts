export const input = {
  title: 'Enum',
  type: 'object',
  properties: {
    stringEnum: {
      type: 'string',
      enum: ['a', 'b', 'c']
    },
    impliedStringEnum: {
      enum: ['a', 'b', 'c']
    },
    booleanEnum: {
      type: 'boolean',
      enum: [true]
    },
    impliedBooleanEnum: {
      enum: [true]
    },
    integerEnum: {
      type: 'integer',
      enum: [-1, 0, 1]
    },
    impliedIntegerEnum: {
      enum: [-1, 0, 1]
    },
    numberEnum: {
      type: 'number',
      enum: [-1.1, 0, 1.2]
    },
    namedIntegerEnum: {
      type: 'integer',
      enum: [1, 2, 3],
      'x-enum-varnames': ['One', 'Two', 'Three']
    },
    impliedNamedIntegerEnum: {
      enum: [4, 5, 6],
      'x-enum-varnames': ['Four', 'Five', 'Six']
    },
    impliedHeterogeneousEnum: {
      enum: [-20.1, null, 'foo', false]
    },
    namedIntegerEnumTitle: {
      type: 'integer',
      enum: [1, 2, 3],
      title: 'NamedInteger',
      'x-enum-varnames': ['One', 'Two', 'Three']
    },
    impliedNamedIntegerEnumTitle: {
      enum: [4, 5, 6],
      title: 'ImpliedNamedInteger',
      'x-enum-varnames': ['Four', 'Five', 'Six']
    },
    oneOfNamedEnum: {
      oneOf: [
        {
          type: 'integer',
          enum: [1, 2, 3],
          title: 'IntegerOneOfNamedEnum',
          'x-enum-varnames': ['One', 'Two', 'Three']
        },
        {
          type: 'string',
          enum: ['four', 'five', 'six'],
          title: 'StringOneOfNamedEnum',
          'x-enum-varnames': ['Four', 'Five', 'Six']
        }
      ]
    },
    anyOfNamedEnum: {
      anyOf: [
        {
          type: 'integer',
          enum: [1, 2, 3],
          title: 'IntegerAnyOfNamedEnum',
          'x-enum-varnames': ['One', 'Two', 'Three']
        },
        {
          type: 'string',
          enum: ['four', 'five', 'six'],
          title: 'StringAnyOfNamedEnum',
          'x-enum-varnames': ['Four', 'Five', 'Six']
        }
      ]
    },
    allOfNamedEnum: {
      allOf: [
        {
          type: 'integer',
          enum: [1, 2, 3],
          title: 'IntegerAllOfNamedEnum',
          'x-enum-varnames': ['One', 'Two', 'Three']
        },
        {
          type: 'string',
          enum: ['four', 'five', 'six'],
          title: 'StringAllOfNamedEnum',
          'x-enum-varnames': ['Four', 'Five', 'Six']
        }
      ]
    }
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
    'oneOfNamedEnum',
    'anyOfNamedEnum',
    'allOfNamedEnum'
  ],
  additionalProperties: false
}

export const options = {
  enableConstEnums: true
}
