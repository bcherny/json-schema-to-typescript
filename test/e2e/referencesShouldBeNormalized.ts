export const input = {
  title: 'Referencing',
  type: 'object',
  properties: {
    a: {
      $ref: 'test/resources/ReferencedTypeNotNormalized.json',
    },
  },
  required: ['a'],
}
