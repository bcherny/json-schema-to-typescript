// @see https://github.com/bcherny/json-schema-to-typescript/issues/131
// By default the schema's `readOnly` annotations do not affect the emitted types
// (see options.readonlyKeyword.ts for the opt-in mapping).
export const input = {
  title: 'ReadOnly',
  type: 'object',
  properties: {
    id: {type: 'string', readOnly: true},
    tags: {type: 'array', items: {type: 'string'}, readOnly: true},
    untypedNullable: {nullable: true, readOnly: true},
  },
  additionalProperties: {type: 'number', readOnly: true},
}
