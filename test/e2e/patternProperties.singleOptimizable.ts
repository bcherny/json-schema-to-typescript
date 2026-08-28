// A single pattern is the index signature itself and goes through the optimizer like any other
// type: `User | {}` renders as `unknown`, not `User | unknown` (and, as before, `User` is then
// not declared).
export const input = {
  title: 'Single',
  type: 'object',
  patternProperties: {
    '^a': {anyOf: [{$ref: '#/definitions/User'}, {}]},
  },
  additionalProperties: false,
  definitions: {
    User: {type: 'object', properties: {id: {type: 'string'}}, required: ['id'], additionalProperties: false},
  },
}
