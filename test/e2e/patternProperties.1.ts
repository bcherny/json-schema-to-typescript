export let input = {
  id: 'Parent',
  type: 'object',
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
