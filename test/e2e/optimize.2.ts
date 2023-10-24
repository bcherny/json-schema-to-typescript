export const input = {
  definitions: {
    a: {
      type: 'string',
      additionalProperties: false,
    },
    b: {
      type: 'object',
    },
    c: {
      type: 'object',
    },
  },
  properties: {
    a: {
      anyOf: [{type: 'string', additionalProperties: false}, {$ref: '#/definitions/a'}],
    },
    b: {
      anyOf: [{type: 'object'}, {type: 'object'}, {$ref: '#/definitions/b'}],
    },
    c: {
      anyOf: [{type: 'object'}, {$ref: '#/definitions/b'}, {$ref: '#/definitions/b'}, {$ref: '#/definitions/c'}],
    },
    d: {
      allOf: [{type: 'object'}, {type: 'object'}],
    },
    e: {
      oneOf: [{type: 'object'}, {allOf: [{type: 'object'}, {type: 'object'}]}],
    },
  },
  required: ['a', 'b', 'c', 'd', 'e'],
  title: 'Optimizable Schema 2',
  type: 'object',
  additionalProperties: false,
}
