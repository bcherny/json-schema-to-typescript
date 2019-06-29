export const input = {
  type: 'object',
  properties: {
    namedEnum: {
      type: 'array',
      items: {
        enum: [1, 2, 3],
        title: 'NamedEnum',
        tsEnumNames: ['One', 'Two', 'Three']
      }
    },
    tuples: {
      type: 'array',
      items: [
        { type: 'string' },
        {
          enum: [1, 2, 3],
          title: 'NamedEnum2',
          tsEnumNames: ['One', 'Two', 'Three']
        }
      ]
    },
    tuplesWithAdditionalAny: {
      type: 'array',
      items: [
        { type: 'string' },
        {
          enum: [1, 2, 3],
          title: 'NamedEnum2',
          tsEnumNames: ['One', 'Two', 'Three']
        }
      ],
      additionalItems: true
    },
    tuplesWithAdditionalEnum: {
      type: 'array',
      items: [
        { type: 'string' },
        {
          enum: [1, 2, 3],
          title: 'NamedEnum2',
          tsEnumNames: ['One', 'Two', 'Three']
        }
      ],
      additionalItems: {
        enum: [4, 5, 6],
        title: 'NamedEnum2',
        tsEnumNames: ['Four', 'Five', 'Six']
      }
    }
  },
  required: ['namedEnum'],
  additionalProperties: false
}
