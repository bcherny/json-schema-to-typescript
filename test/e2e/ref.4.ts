export const input = {
  title: 'Referencing',
  type: 'object',
  properties: {
    foo: {
      $ref: 'ReferencedType.json',
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
