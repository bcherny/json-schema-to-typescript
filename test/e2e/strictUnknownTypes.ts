export const input = {
  title: 'StrictUnknownTypes',
  type: 'object',
  properties: {
    additionalItemsAny: {
      type: 'array',
      items: [
        {
          enum: [1, 2, 3],
          title: 'NamedEnum2',
          tsEnumNames: ['One', 'Two', 'Three']
        }
      ],
      additionalItems: true
    },
    withMinItems: {
      type: 'array',
      description: 'minItems = 3',
      minItems: 3
    },
    withMaxItems: {
      type: 'array',
      description: 'maxItems = 3',
      maxItems: 3
    }
  },
  additionalProperties: true
}

export const options = {
  strictUnknownTypes: true
}
