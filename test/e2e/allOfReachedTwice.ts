// A schema that is both an OBJECT and an ALL_OF parses as an intersection of the two.
// Reaching it a second time (here through two `minItems` arrays, which the optimizer
// does not look inside) must give back that intersection as it was built, not push
// the object member onto it again (`Step = {uses} & {name} & {name} & ...`).
export const input = {
  title: 'AllOfReachedTwice',
  type: 'object',
  properties: {
    build: {type: 'array', minItems: 1, items: {$ref: '#/definitions/step'}},
    deploy: {type: 'array', minItems: 1, items: {$ref: '#/definitions/step'}},
  },
  additionalProperties: false,
  definitions: {
    step: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        parallel: {type: 'array', minItems: 1, items: {$ref: '#/definitions/step'}},
      },
      allOf: [{type: 'object', properties: {uses: {type: 'string'}}, required: ['uses']}],
      additionalProperties: false,
    },
  },
}
