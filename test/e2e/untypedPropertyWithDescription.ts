/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/654
 * A property schema made of annotation keywords only (`description`) is no
 * more constrained than the empty schema, so it should emit `unknown`, not
 * `{[k: string]: unknown}`. Same input as PR #707's test of this name; the
 * snapshot entry holds the expected output, so this fails on master.
 */
export const input = {
  title: 'Foo',
  properties: {
    foo: {
      description: 'Foo is untyped, should allow anything',
    },
  },
}
