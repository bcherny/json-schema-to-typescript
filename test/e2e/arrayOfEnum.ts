export const input = {
  type: 'object',
  properties: {
    namedEnum: {
      type: 'array',
      items: {
        enum: [1, 2, 3],
        title: 'NamedEnum',
        tsEnumNames: ['One', 'Two', 'Three'],
      },
    },
    tuples: {
      type: 'array',
      items: [
        {type: 'string'},
        {
          enum: [1, 2, 3],
          title: 'NamedEnum2',
          tsEnumNames: ['One', 'Two', 'Three'],
        },
      ],
    },
  },
  required: ['namedEnum'],
  additionalProperties: false,
}
