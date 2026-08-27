/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/76
 * A tight cycle: `definitions.bar` is only a $ref back to itself, so it never
 * bottoms out in a concrete schema. Previously excluded from the suite; enabled
 * here (without `error = true`) so it fails until compile() handles it.
 */
export const input = {
  additionalProperties: true,
  properties: {
    foo: {
      $ref: '#/definitions/bar',
    },
  },
  definitions: {
    bar: {
      $ref: '#/definitions/bar',
    },
  },
  required: ['foo'],
  title: 'Cycle (3)',
}
