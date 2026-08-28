// https://github.com/bcherny/json-schema-to-typescript/pull/634: an empty `anyOf`/`oneOf`
// accepts nothing (`never`); an empty `allOf` constrains nothing.
export const input = {
  type: 'object',
  properties: {
    a: {anyOf: []},
    b: {oneOf: []},
    c: {allOf: []},
    d: {multipleOf: []},
    e: {type: 'array', items: {anyOf: []}},
    f: {anyOf: [], description: 'still never'},
  },
  additionalProperties: false,
}
