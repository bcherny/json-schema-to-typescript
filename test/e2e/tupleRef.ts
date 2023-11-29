export const input = {
  additionalProperties: false,
  definitions: {
    a: {type: 'string'},
    b: {type: 'number'},
  },
  properties: {
    c: {
      items: [{$ref: '#/definitions/a'}, {$ref: '#/definitions/b'}],
      type: 'array',
    },
  },
  type: 'object',
}
