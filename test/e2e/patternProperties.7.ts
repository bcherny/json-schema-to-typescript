// @see https://github.com/bcherny/json-schema-to-typescript/issues/546
export const input = {
  type: 'object',
  patternProperties: {
    '^[a-z][a-z0-9-]*/[a-z][a-z0-9-]*$': {
      type: 'string',
    },
  },
}
