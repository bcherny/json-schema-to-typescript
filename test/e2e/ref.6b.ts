export const input = {
  title: 'Referencing Combined',
  type: 'object',
  properties: {
    foo: {
      $ref: 'test/resources/ReferencedCombinationType.json',
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

export const options = {
  declareExternallyReferenced: false,
}
