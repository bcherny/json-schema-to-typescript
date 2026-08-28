/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/614
 * The issue's a.json (this input) wraps a `$ref` to b.json
 * (test/resources/RecursiveOneOf.json) in a one-member `oneOf`; b.json is an
 * anonymous (no title / $id) `oneOf` of `string` and an array whose `items`
 * point back at b's own root (`"$ref": "#"`). The optimizer collapses the
 * one-member union, the recursive member never gets a standalone name, and
 * the generator recurses until "RangeError: Maximum call stack size exceeded".
 * b.json on its own compiles fine (`export type B = string | B[]`). The same
 * crash happens single-file when the target lives outside definitions/$defs:
 * {oneOf: [{$ref: '#/x'}], x: {oneOf: [{type: 'string'}, {type: 'array', items: {$ref: '#/x'}}]}}
 */
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  oneOf: [{$ref: 'RecursiveOneOf.json'}],
}

export const options = {
  cwd: 'test/resources/',
}
