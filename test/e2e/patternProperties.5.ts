export let input = {
  id: 'Parent',
  type: 'object',
  additionalProperties: true,
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
