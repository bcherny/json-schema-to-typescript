/** @see https://github.com/bcherny/json-schema-to-typescript/issues/161 */
// patternProperties on an inline (unnamed) object schema: the generated docblock says
// "referenced by `undefined`'s JSON-Schema definition". The expected snapshot names the
// property key instead (one of the options; dropping the sentence is the other).
export const input = {
  title: 'Procfile',
  type: 'object',
  properties: {
    process_types: {
      description: 'hash mapping process type names to their respective command',
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9_-]+$': {type: 'string', title: 'Command'},
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}
