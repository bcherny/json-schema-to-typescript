/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/440
 * Draft-03 style `required: true` on a property schema (still typed as
 * `required?: boolean | string[]` on JSONSchema4, and the normalizer already
 * maps `required: false` to `[]`) is silently ignored: `name` comes out
 * optional. The snapshot entry is hand-written to the expected `name: string`,
 * so this fails on master. Whether this is on by default or behind an option is
 * a maintainer decision.
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
