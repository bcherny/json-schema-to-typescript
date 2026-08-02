// @see https://github.com/bcherny/json-schema-to-typescript/issues/690
// Nested bounded arrays multiply together (an array of N arrays of M items can
// emit up to N*M item combinations), so each level must be checked against the
// cumulative product of its ancestors' maxItems, not just its own maxItems.
export const input = {
  type: 'array',
  items: {
    type: 'array',
    items: {type: 'array', items: {type: 'string'}, minItems: 1, maxItems: 10},
    minItems: 1,
    maxItems: 10,
  },
  minItems: 1,
  maxItems: 10,
}
