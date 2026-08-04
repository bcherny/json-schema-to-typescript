// @see https://github.com/bcherny/json-schema-to-typescript/issues/725
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Base0: false,
  },
  not: {
    properties: {
      name: {
        items: [{$ref: '#/definitions/Base0'}],
      },
    },
  },
}
