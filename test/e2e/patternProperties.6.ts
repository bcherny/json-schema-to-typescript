export let input = {
  id: 'Parent',
  type: 'object',
  additionalProperties: {
    type: 'number',
  },
  patternProperties: {
    '^[a-zA-Z]+': {
      id: 'StringChild',
      type: 'string',
    },
  },
}
