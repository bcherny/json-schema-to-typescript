// An interface with a typed index signature widens it over its supertype's properties, which the
// optimizer may simplify later on (Base.x: `A | {a: string}` -> `A`): S and its inline twin in p3
// must still come out as the same type, so p3 is just `S`
const A = {type: 'object', properties: {a: {type: 'string'}}, required: ['a'], additionalProperties: false}
const S = {
  type: 'object',
  extends: {$ref: '#/definitions/Base'},
  properties: {s: {type: 'string'}},
  additionalProperties: {type: 'number'},
}
export const input = {
  title: 'Root',
  type: 'object',
  additionalProperties: false,
  definitions: {
    A,
    Base: {
      type: 'object',
      properties: {x: {anyOf: [{$ref: '#/definitions/A'}, JSON.parse(JSON.stringify(A))]}},
      additionalProperties: false,
    },
    S,
  },
  properties: {
    p1: {anyOf: [{$ref: '#/definitions/S'}, {type: 'string'}]},
    p2: {$ref: '#/definitions/Base'},
    p3: {anyOf: [{$ref: '#/definitions/S'}, JSON.parse(JSON.stringify(S))]},
  },
}
