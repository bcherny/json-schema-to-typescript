export let input = {
  id: 'Parent',
  type: 'object',
  additionalProperties: false,
  patternProperties: {
    '^[0-9]+': {
      id: 'NumberChild',
      type: 'number',
    },
    '^[a-zA-Z]+': {
      id: 'StringChild',
      type: 'string',
    },
  },
}
