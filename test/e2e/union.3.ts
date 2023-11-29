// @see https://github.com/bcherny/json-schema-to-typescript/issues/352
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'my-schema',
  type: 'object',
  properties: {
    example: {
      type: ['boolean', 'string'],
      default: true,
    },
  },
  additionalProperties: false,
}
