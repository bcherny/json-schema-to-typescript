export const input = {
  type: 'object',
  properties: {
    a: {anyOf: []},
    b: {oneOf: []},
    c: {allOf: []},
    d: {multipleOf: []},
  },
  additionalProperties: false,
}
