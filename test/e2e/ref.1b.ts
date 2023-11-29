export const input = {
  title: 'Referencing',
  type: 'object',
  properties: {
    foo: {
      $ref: 'test/resources/ReferencedType.json',
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

export const options = {
  declareExternallyReferenced: false,
}
