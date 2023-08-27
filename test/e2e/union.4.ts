// @see https://github.com/bcherny/json-schema-to-typescript/issues/357
export const input = {
  oneOf: [
    {
      type: 'string',
    },
    {
      enum: [false],
    },
  ],
  default: 'foo',
}
