// @see https://github.com/bcherny/json-schema-to-typescript/issues/363
export const input = {
  title: 'RefWithAnnotationSiblings',
  type: 'object',
  properties: {
    correct: {
      $ref: '#/definitions/color',
    },
    wrong: {
      description: 'should be referenced',
      $ref: '#/definitions/color',
    },
  },
  additionalProperties: false,
  definitions: {
    color: {
      type: 'string',
      enum: ['red', 'green', 'blue'],
    },
  },
}
