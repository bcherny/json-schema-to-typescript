// S's typed index signature is widened over the members of p1's union, which S reaches through a
// `$ref` while the optimizer is still working on that union: S and its inline twin in p2 must
// still come out as the same type, so p2 is just `S`
const A = {type: 'object', properties: {a: {type: 'string'}}, required: ['a'], additionalProperties: false}
const S = () => ({
  type: 'object',
  properties: {back: {$ref: '#/properties/p1'}},
  additionalProperties: {type: 'number'},
})
export const input = {
  title: 'Root',
  type: 'object',
  additionalProperties: false,
  definitions: {A, S: S()},
  properties: {
    p1: {
      anyOf: [
        {$ref: '#/definitions/S'},
        {anyOf: [{$ref: '#/definitions/S'}, {type: 'string'}]},
        {anyOf: [{$ref: '#/definitions/A'}, JSON.parse(JSON.stringify(A))]},
      ],
    },
    p2: {anyOf: [{$ref: '#/definitions/S'}, S()]},
  },
}
