/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/434
 * An explicit `type: 'object'` must win over the JS type of `default`; master
 * emits `string`. Same input and file name as PR #715's test; the snapshot
 * entry holds #715's expected output (an object interface), so this fails on
 * master.
 */
export const input = {
  type: 'object',
  default: 'foo',
}
