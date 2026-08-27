// Root-level variant of allOfEmptySchema: `allOf: [{}, {$ref: User}]` at the root used to
// compile to an empty file (the root type collapsed to a bare `unknown` and was never declared).
export const input = {
  title: 'AllOfEmptySchemaRoot',
  allOf: [{}, {$ref: '#/definitions/User'}],
  definitions: {
    User: {
      type: 'object',
      properties: {
        id: {type: 'string'},
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
}
