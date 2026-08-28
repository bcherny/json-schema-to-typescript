/**
 * @see https://github.com/bcherny/json-schema-to-typescript/pull/672
 *
 * Same as typeArrayWithProperties.ts, but the multi-type schema is an untitled
 * definition reached through a `$ref` (the normalizer gives such definitions an
 * `$id` too). Expected: `type Note = {text?: string} | null`, not
 * `type Note = {text?: string} & Note1`.
 */
export const input = {
  type: 'object',
  properties: {
    note: {$ref: '#/definitions/note'},
    contact: {$ref: '#/definitions/contact'},
  },
  additionalProperties: false,
  definitions: {
    note: {
      type: ['object', 'null'],
      properties: {
        text: {type: 'string'},
      },
      additionalProperties: false,
    },
    contact: {
      type: ['object', 'string'],
      properties: {
        email: {type: 'string'},
      },
      required: ['email'],
      additionalProperties: false,
    },
  },
}
