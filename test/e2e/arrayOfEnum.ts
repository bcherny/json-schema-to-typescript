export const input = {
  type: 'object',
  properties: {
    namedEnum: {
      type: 'array',
      items: {
        enum: [1, 2, 3],
        title: 'NamedEnum',
        'x-enum-varnames': ['One', 'Two', 'Three']
      }
    },
    tuples: {
      type: 'array',
      items: [
        {type: 'string'},
        {
          enum: [1, 2, 3],
          title: 'NamedEnum2',
          'x-enum-varnames': ['One', 'Two', 'Three']
        }
      ]
    }
  },
  required: ['namedEnum'],
  additionalProperties: false
}
