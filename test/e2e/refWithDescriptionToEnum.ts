/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/472
 * A `$ref` to an enum definition keeps its named type (`Shared`) when the ref
 * has no siblings, but adding a sibling `description` inlines the enum as
 * `"a" | "b"` and drops `Shared` from the output. The snapshot entry is
 * hand-written to the reporter's expected output (named `Shared`, description
 * on the property); where the description lands is a maintainer decision, the
 * discriminating lines are `export type Shared` and `first?: Shared`.
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
