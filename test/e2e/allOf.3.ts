// https://github.com/bcherny/json-schema-to-typescript/issues/369
// An `allOf` made up entirely of members this tool doesn't recognize (so every
// member gets filtered out) should collapse cleanly instead of intersecting with
// a leftover `{[k: string]: unknown}`, or (for `anyOf`/`oneOf`) producing invalid
// `()` output.
export const input = {
  title: 'AllOfAllVacuous',
  allOf: [{not: {}}, {if: {}, then: {}, else: {}}],
}
