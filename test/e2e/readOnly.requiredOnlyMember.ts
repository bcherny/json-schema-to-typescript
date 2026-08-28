// @see https://github.com/bcherny/json-schema-to-typescript/issues/131
// A required-only `allOf`/`anyOf` member re-declares the parent's property: it stays readonly there
// too, or the intersection would make it writable again.
export const input = {
  title: 'ReadOnlyRequiredOnlyMember',
  type: 'object',
  properties: {
    id: {type: 'string', readOnly: true},
    etag: {type: 'string', readOnly: true},
    name: {type: 'string'},
  },
  additionalProperties: false,
  anyOf: [{required: ['id']}, {required: ['etag', 'name']}],
}
