export const input = {
  $schema: 'http://json-schema.org/draft-03/schema',
  id: 'http://mycompany.com/api/referencing.json',
  title: 'Referencing',
  type: 'object',
  properties: {
    ref: {
      $ref: 'test/resources/ReferencedType.json',
    },
  },
  required: ['ref'],
  additionalProperties: false,
}
