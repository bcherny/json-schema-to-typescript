// @see https://github.com/bcherny/json-schema-to-typescript/issues/355
const idSchema = {type: 'integer', minimum: 1}

export const input = {
  type: 'object',
  properties: {
    id: idSchema,
    userId: idSchema,
  },
}
