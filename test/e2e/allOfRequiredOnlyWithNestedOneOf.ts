// https://github.com/bcherny/json-schema-to-typescript/issues/381
// Required-only members under `allOf` (and a nested `oneOf` of them) are parsed in
// isolation from the parent's `properties`, so each collapses to
// `{[k: string]: unknown}` (the optimizer then folds the duplicates into one) and
// every `required` is lost: `prop1` stays optional and the oneOf disappears.
// Same family as #567 / #513 (anyOf/oneOf). Expected output is hand-written from
// the issue = what master emits when each required-only member is spelled out with
// the parent's matching property and `additionalProperties: false`.
export const input = {
  title: 'Test',
  type: 'object',
  properties: {
    prop1: {type: 'string'},
    prop2: {type: 'string'},
    prop3: {type: 'string'},
  },
  allOf: [{required: ['prop1']}, {oneOf: [{required: ['prop2']}, {required: ['prop3']}]}],
  additionalProperties: false,
}
