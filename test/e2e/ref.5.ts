export const input = {
  title: 'Referencing',
  type: 'object',
  properties: {
    foo: {
      $ref: 'ReferencedTypeWithoutID.json',
    },
    bar: {
      $ref: 'ReferencedTypeWithoutIDConflict.json',
    },
  },
  required: ['foo', 'bar'],
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
