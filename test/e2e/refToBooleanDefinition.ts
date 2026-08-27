/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/725
 * A $ref whose target is a boolean schema (`false`). The resolver's
 * onDereference callback uses the dereferenced value as a WeakMap key,
 * and a boolean is not a valid key: "Invalid value used as weak map key".
 */
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Base0: false,
  },
  items: [{$ref: '#/definitions/Base0'}],
}
