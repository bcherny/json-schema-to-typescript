/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/440
 * Draft 3 style `required: true` on a property schema marks the property as
 * required, like listing it in the parent's `required` array.
 */
export const input = {
  title: 'Test',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true,
    },
  },
}
