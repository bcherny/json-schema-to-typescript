/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/649
 * Reduced from https://json.schemastore.org/web-types (regression in 15.0.0).
 * `Attribute` is both an ALL_OF and an OBJECT, so it parses as an
 * intersection; the cycle Attribute -> Host -> attributes -> Attribute
 * re-enters parse() while the intersection is still the empty cache
 * placeholder: "Cannot read properties of undefined (reading 'push')".
 */
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
