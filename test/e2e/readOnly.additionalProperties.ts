// @see https://github.com/bcherny/json-schema-to-typescript/issues/131
// The index signature is readonly only when every schema folded into it is `readOnly: true`.
export const input = {
  title: 'ReadOnlyAdditionalProperties',
  type: 'object',
  properties: {
    allReadOnly: {
      type: 'object',
      additionalProperties: {type: 'string', readOnly: true},
    },
    mixed: {
      title: 'Mixed',
      type: 'object',
      patternProperties: {'^a': {type: 'string', readOnly: true}, '^b': {type: 'number'}},
      additionalProperties: false,
    },
    open: {
      description: '`additionalProperties: true` admits anything, writable',
      type: 'object',
      patternProperties: {'^a': {type: 'string', readOnly: true}},
      additionalProperties: true,
    },
    unannotated: {
      type: 'object',
      additionalProperties: {type: 'string'},
    },
  },
  additionalProperties: false,
}
