export const input = {
  title: 'MergeRequiredFromAllOf',
  type: 'object',
  properties: {
    reference: {
      allOf: [
        {
          $ref: '#/definitions/defined'
        }
      ],
      required: ['foo']
    }
  },
  definitions: {
    defined: {
      additionalProperties: true,
      type: 'object',
      properties: {
        foo: {
          type: 'integer'
        },
        bar: {
          type: 'string'
        }
      },
      required: ['bar']
    }
  },
  required: [],
  additionalProperties: false
}
