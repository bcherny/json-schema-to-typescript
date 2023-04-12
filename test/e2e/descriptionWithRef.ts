export const input = {
  $defs: {
    shared: {
      enum: ['a', 'b']
    }
  },
  properties: {
    first: {
      $ref: '#/$defs/shared',
      description: 'A first property.'
    }
  },
  additionalProperties: false,
  title: 'Example Schema',
  type: 'object'
}
