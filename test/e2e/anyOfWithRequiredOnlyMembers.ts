/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/513
 * `anyOf` members that carry only `required` ("at least one of these keys")
 * know nothing about the sibling `properties`, so each member parses to
 * `{[k: string]: unknown}` and the union collapses to an index signature
 * intersected with the all-optional base. The expected output is a maintainer
 * decision (see the maintainer's 2023 and 2026 comments on the issue); the
 * snapshot entry for this case encodes the 2023 proposal - each member borrows
 * the listed keys from the parent's `properties` as required - so the test
 * fails on master showing the lost `a`/`b` types. Change that one entry if
 * another output is chosen.
 */
export const input = {
  title: 'Example Schema',
  type: 'object',
  anyOf: [{required: ['a']}, {required: ['b']}],
  properties: {
    a: {type: 'string'},
    b: {type: 'string'},
  },
  additionalProperties: false,
}
