// @see https://github.com/bcherny/json-schema-to-typescript/issues/131
// A `required` key with no `properties` entry is typed by the `patternProperties` it matches, else
// by `additionalProperties` (see required.ts). Like the index signature those fold into, the member
// is readonly only when every schema that applies to it is `readOnly: true`.
export const input = {
  title: 'ReadOnlyRequiredUndeclared',
  type: 'object',
  patternProperties: {
    '^ro_': {type: 'number', readOnly: true},
    '^rw_': {type: 'number'},
    _at$: {type: 'number', readOnly: true},
  },
  additionalProperties: {type: 'string', readOnly: true},
  required: ['ro_count', 'rw_count', 'rw_created_at', 'ro_updated_at', 'other'],
  definitions: {
    allReadOnly: {
      title: 'AllReadOnly',
      type: 'object',
      additionalProperties: {type: 'string', readOnly: true},
      required: ['id'],
    },
    untyped: {
      title: 'Untyped',
      type: 'object',
      required: ['loose'],
    },
  },
}

export const options = {
  readonlyKeyword: true,
  unreachableDefinitions: true,
}
