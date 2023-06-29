export const input = {
  title: 'Referencing String externally',
  type: 'object',
  properties: {
    foo: {
      $ref: 'test/resources/String.json'
    }
  },
  required: ['foo'],
  additionalProperties: false
}

export const options = {
  declareExternallyReferenced: true
}
