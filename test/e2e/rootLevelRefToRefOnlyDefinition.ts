// A root-level `$ref` whose target is a definition that is itself nothing but a `$ref`.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/740
export const input = {
  definitions: {
    Ref0: {type: 'string'},
    Item1: {$ref: '#/definitions/Ref0'},
  },
  $ref: '#/definitions/Item1',
}
