// https://github.com/bcherny/json-schema-to-typescript/issues/410
// A root schema that is a nullable `$ref` and also hosts the `definitions` the `$ref`
// points into: `definitions`/`$defs` have to stay where the pointer expects them when
// `nullable` is rewritten before dereferencing. Expected = what master emits for
// `anyOf: [{$ref: '#/definitions/Bar'}, {type: 'null'}]` at the root.
export const input = {
  $ref: '#/definitions/Bar',
  nullable: true,
  definitions: {Bar: {type: 'object', properties: {baz: {type: 'boolean'}}}},
}
