/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/486
 * `{type: "object", properties: {}, additionalProperties: false}` allows no
 * keys at all, but master emits `export interface Empty {}`, which accepts any
 * object. Same input and file name as PR #700's test; the snapshot entry holds
 * #700's proposed output (`[k: string]: never`), so this fails on master. The
 * exact spelling of "no properties" is a maintainer decision - change the one
 * snapshot entry if another is chosen.
 */
export const input = {
  title: 'Empty',
  type: 'object',
  properties: {},
  additionalProperties: false,
}
