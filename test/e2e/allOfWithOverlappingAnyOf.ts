/**
 * @see https://github.com/bcherny/json-schema-to-typescript/pull/672
 *
 * Pins that a schema which really is an intersection keeps it: `allOf: [A, anyOf: [A, B]]`
 * must emit `A & (A | B)` (which TypeScript narrows to `A`), not the wider `A | B`.
 */
export const input = {
  allOf: [
    {$ref: '#/definitions/a'},
    {
      anyOf: [{$ref: '#/definitions/a'}, {$ref: '#/definitions/b'}],
    },
  ],
  definitions: {
    a: {
      type: 'object',
      properties: {x: {type: 'string'}},
      required: ['x'],
      additionalProperties: false,
    },
    b: {
      type: 'object',
      properties: {y: {type: 'number'}},
      required: ['y'],
      additionalProperties: false,
    },
  },
}
