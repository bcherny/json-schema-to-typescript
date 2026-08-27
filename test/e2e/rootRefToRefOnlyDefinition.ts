/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/740
 * The root schema is a $ref to a definition that is itself nothing but a
 * $ref (no cycle). json-schema-ref-parser leaves `$ref: "#"` on the root,
 * so the parser hits "Refs should have been resolved by the resolver!".
 * Expected: `export type RootRefToRefOnlyDefinition = string`.
 */
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Ref0: {type: 'string'},
    Item1: {$ref: '#/definitions/Ref0'},
  },
  $ref: '#/definitions/Item1',
}
