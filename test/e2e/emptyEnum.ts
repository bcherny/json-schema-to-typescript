/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/463
 * `enum: []` admits no values; master emits `export type QueryMsg = ()`,
 * which prettier rejects (`SyntaxError: '=>' expected`). Same input and file
 * name as PR #711's test; the snapshot entry holds #711's expected output
 * (`never`), so this fails on master.
 */
export const input = {
  title: 'QueryMsg',
  type: 'string',
  enum: [],
}
