export const input = {
  title: 'AllOf',
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      allOf: [{$ref: '#/definitions/foo'}, {$ref: '#/definitions/bar'}],
    },
  },
  definitions: {
    foo: {
      properties: {
        a: {type: 'string'},
        b: {type: 'integer'},
      },
      additionalProperties: false,
      required: ['a', 'b'],
    },
    bar: {
      properties: {
        a: {type: 'string'},
      },
      additionalProperties: false,
      required: ['a', 'b'],
    },
  },
  required: ['foo', 'bar'],
  additionalProperties: false,
}
