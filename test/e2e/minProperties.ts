// `minProperties` at or above the number of declared properties, with nothing else
// allowed to supply keys, means every property must be present.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/565
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'MinProperties',
  type: 'object',
  properties: {
    // all required: minProperties covers every declared property
    allRequired: {
      type: 'object',
      additionalProperties: false,
      minProperties: 2,
      properties: {
        a: {type: 'number'},
        b: {type: 'string'},
      },
    },
    // unchanged: minProperties is below the number of declared properties
    someRequired: {
      type: 'object',
      additionalProperties: false,
      minProperties: 1,
      properties: {
        a: {type: 'number'},
        b: {type: 'string'},
      },
    },
    // unchanged: additionalProperties can supply the extra keys
    additionalPropertiesAllowed: {
      type: 'object',
      minProperties: 2,
      properties: {
        a: {type: 'number'},
        b: {type: 'string'},
      },
    },
    // unchanged: patternProperties can supply the extra keys
    patternPropertiesAllowed: {
      type: 'object',
      additionalProperties: false,
      minProperties: 2,
      patternProperties: {'^x-': {type: 'string'}},
      properties: {
        a: {type: 'number'},
        b: {type: 'string'},
      },
    },
  },
}
