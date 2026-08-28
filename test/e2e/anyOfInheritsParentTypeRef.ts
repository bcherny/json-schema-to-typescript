// https://github.com/bcherny/json-schema-to-typescript/issues/528
// An untyped `anyOf` member that came from a `$ref` is the shared definition object
// itself, so inheriting the parent's `type` into it must not rewrite the definition:
// `Loose` stays an open interface and `b` is not a string.
export const input = {
  type: 'object',
  definitions: {
    loose: {description: 'anything goes'},
  },
  properties: {
    a: {type: 'string', anyOf: [{$ref: '#/definitions/loose'}]},
    b: {$ref: '#/definitions/loose'},
  },
  additionalProperties: false,
}
