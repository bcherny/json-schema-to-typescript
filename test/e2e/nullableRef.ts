// https://github.com/bcherny/json-schema-to-typescript/issues/410
// `nullable: true` (OpenAPI 3.0) next to a `$ref` is silently dropped: nothing in
// src/ reads `nullable`, and the ref parser merges the sibling into a copy of Bar
// that is then named Bar again. Expected output is hand-written from the issue
// (`bar: Bar | null`) = what master emits for `oneOf: [{$ref}, {type: 'null'}]`.
// Whether `nullable` should be honoured everywhere or behind an option is a
// maintainer decision (four earlier PRs — #312 #411 #522 #535 — were closed).
export const input = {
  title: 'Foo',
  definitions: {
    Bar: {type: 'object', properties: {baz: {type: 'boolean'}}},
  },
  type: 'object',
  properties: {bar: {$ref: '#/definitions/Bar', nullable: true}},
  required: ['bar'],
}
