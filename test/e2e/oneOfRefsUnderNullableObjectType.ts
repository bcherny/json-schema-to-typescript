// `type: ['object', 'null']` next to a `oneOf` of two object definitions: a value must be an
// object or null AND match one of A, B -- and neither admits null -- so this is just `A | B`,
// not the union re-parsed once per type with the `oneOf` still attached to each.
export const input = {
  type: ['object', 'null'],
  oneOf: [{$ref: '#/definitions/a'}, {$ref: '#/definitions/b'}],
  definitions: {
    a: {type: 'object', properties: {x: {type: 'string'}}, required: ['x'], additionalProperties: false},
    b: {type: 'object', properties: {y: {type: 'number'}}, required: ['y'], additionalProperties: false},
  },
}
