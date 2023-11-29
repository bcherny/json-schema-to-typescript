// Cycle in referenced schema
// @see https://github.com/bcherny/json-schema-to-typescript/issues/376
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    owner: {$ref: 'test/resources/Person.json'},
  },
}
