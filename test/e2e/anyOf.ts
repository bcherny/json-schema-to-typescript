export const input = {
  title: 'AnyOf',
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      anyOf: [{$ref: '#/definitions/foo'}, {$ref: '#/definitions/bar'}, {$ref: '#/definitions/baz'}],
    },
  },
  definitions: {
    foo: {
      properties: {
        a: {type: 'string'},
        b: {type: 'integer'},
      },
      additionalProperties: false,
      required: ['a'],
    },
    bar: {
      properties: {
        a: {enum: ['a', 'b', 'c']},
        bam: {
          type: 'array',
          items: {
            anyOf: [
              {
                enum: ['wam'],
              },
            ],
          },
        },
      },
    },
    baz: {
      properties: {
        baz: {$ref: '#/definitions/bar'},
      },
    },
  },
  required: ['foo'],
  additionalProperties: false,
}
