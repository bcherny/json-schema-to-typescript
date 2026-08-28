/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/472
 * A `$ref` to an enum definition with a sibling `description`: the enum stays the named
 * type `Shared` (it was inlined as `"a" | "b"` and `Shared` dropped from the output), and
 * the description documents the property.
 */
export const input = {
  $defs: {
    shared: {
      enum: ['a', 'b'],
    },
  },
  properties: {
    first: {
      $ref: '#/$defs/shared',
      description: 'A first property.',
    },
  },
  additionalProperties: false,
  title: 'ExampleSchema',
  type: 'object',
}
