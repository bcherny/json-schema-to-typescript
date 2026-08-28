// A tight cycle: `definitions.bar` is nothing but a $ref back to itself, so it
// never bottoms out in a concrete type (like `type Bar = Bar` in TypeScript).
// This should produce a clear error rather than crash.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/76
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

export const error = 'cycle with no concrete base case'
