// The `anyOf` twin of oneOfRefsUnderNullableObjectType, with `properties` of its own next to
// the type array: the object arm keeps them, the `null` arm has no member that admits it.
export const input = {
  type: ['object', 'null'],
  properties: {p: {type: 'string'}},
  anyOf: [{$ref: '#/definitions/a'}, {$ref: '#/definitions/b'}],
  definitions: {
    a: {type: 'object', properties: {x: {type: 'string'}}, required: ['x'], additionalProperties: false},
    b: {type: 'object', properties: {y: {type: 'number'}}, required: ['y'], additionalProperties: false},
  },
}
