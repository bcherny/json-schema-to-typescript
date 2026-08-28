/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/440
 * Draft 3 property-level `required: true` under `strictIndexSignatures`: same output
 * as listing the property in the parent's `required` array.
 */
export const input = {
  title: 'StrictIndexSignaturesRequiredBoolean',
  type: 'object',
  properties: {
    flagged: {type: 'string', required: true},
    unflagged: {type: 'string'},
  },
  additionalProperties: {type: 'string'},
}

export const options = {
  strictIndexSignatures: true,
}
