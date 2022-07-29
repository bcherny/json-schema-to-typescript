export const input = {
  title: 'Enum',
  type: 'object',
  definitions: {
    shared: {
      enum: ['a', 'b']
    }
  },
  properties: {
    first: {
      $ref: '#/definitions/shared',
      description: 'A first property.'
    }
  },
  additionalProperties: false
}
