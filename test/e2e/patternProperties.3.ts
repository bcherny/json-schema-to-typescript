export let input = {
  id: 'Parent',
  type: 'object',
  additionalProperties: false,
  patternProperties: {
    '^[a-zA-Z]+': {
      id: 'Child',
      type: 'object',
      properties: {
        aProperty: {type: 'string'},
      },
    },
  },
}
