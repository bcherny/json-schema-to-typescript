// @see https://github.com/bcherny/json-schema-to-typescript/issues/131
// `readonlyKeyword: false` ignores the schema's `readOnly` annotations.
export const input = {
  title: 'ReadonlyKeywordOff',
  type: 'object',
  properties: {
    id: {type: 'string', readOnly: true},
    tags: {type: 'array', items: {type: 'string'}, readOnly: true},
  },
  additionalProperties: {type: 'number', readOnly: true},
}

export const options = {
  readonlyKeyword: false,
}
