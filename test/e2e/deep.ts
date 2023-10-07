export const input = {
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      oneOf: [
        {
          oneOf: [
            {type: 'number'},
            {$ref: '#/definitions/foo'},
            {$ref: '#/definitions/bar'},
            {
              properties: {
                baz: {type: 'number'},
              },
            },
          ],
        },
        {$ref: '#/definitions/bar'},
      ],
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
      required: ['a', 'b'],
    },
  },
  required: ['foo'],
  additionalProperties: false,
}
