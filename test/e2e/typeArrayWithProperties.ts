/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/256
 * @see https://github.com/bcherny/json-schema-to-typescript/pull/672
 *
 * A root schema (which the normalizer always gives an `$id`) whose `type` is an
 * array that includes "object", plus `properties`. Expected: `{text?: string} | null`,
 * not `{text?: string} & ({text?: string} | null)` (where the `null` arm is unreachable).
 */
export const input = {
  type: ['object', 'null'],
  properties: {
    text: {type: 'string'},
  },
  additionalProperties: false,
}
