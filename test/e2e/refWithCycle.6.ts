// Cycle through a schema that is both an ALL_OF and an OBJECT, so it is parsed as
// an intersection. The cycle re-enters the intersection while it is still being built.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/649
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Attribute: {
      type: 'object',
      allOf: [{$ref: '#/definitions/Host'}],
      properties: {
        name: {type: 'string'},
      },
    },
    Host: {
      type: 'object',
      properties: {
        attributes: {
          type: 'array',
          items: {$ref: '#/definitions/Attribute'},
        },
      },
    },
  },
  type: 'object',
  properties: {
    root: {$ref: '#/definitions/Attribute'},
  },
}
