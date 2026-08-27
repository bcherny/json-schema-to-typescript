/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/528
 * A parent `type: "string"` must apply to every `anyOf` member that has no
 * `type` of its own. On master only the first member inherits it; the second
 * (`{format: 'ipv6'}`) falls back to `{[k: string]: unknown}`, so the output is
 * `{[k: string]: unknown} & string` instead of `string`. Same input and file
 * name as PR #710's test; the snapshot entry holds the expected output, so this
 * fails on master.
 */
export const input = {
  type: 'string',
  anyOf: [{format: 'hostname'}, {format: 'ipv6'}],
}
