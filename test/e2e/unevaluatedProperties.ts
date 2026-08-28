// `unevaluatedProperties` (draft 2019-09+) constrains the same set of keys as
// `additionalProperties` for schemas that declare their properties inline.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/442
export const input = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'UnevaluatedProperties',
  type: 'object',
  properties: {
    // closed: no index signature
    closed: {
      type: 'object',
      properties: {bar: {type: 'string'}},
      unevaluatedProperties: false,
    },
    // constrained by a schema: index signature of that type
    constrained: {
      type: 'object',
      properties: {bar: {type: 'string'}},
      unevaluatedProperties: {type: 'number'},
    },
    // an explicit additionalProperties is the narrower constraint, so it wins
    additionalPropertiesWins: {
      type: 'object',
      properties: {bar: {type: 'string'}},
      additionalProperties: false,
      unevaluatedProperties: {type: 'number'},
    },
    // unchanged when the keyword is absent
    open: {
      type: 'object',
      properties: {bar: {type: 'string'}},
    },
  },
}
