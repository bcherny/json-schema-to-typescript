/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/730
 * The root schema is a $ref to a definition that refers back to itself
 * through a property. json-schema-ref-parser leaves a literal {$ref} node
 * in the tree, so the parser hits "Refs should have been resolved by the
 * resolver!".
 */
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $ref: '#/definitions/Node',
  definitions: {
    Node: {
      type: 'object',
      properties: {
        child: {$ref: '#/definitions/Node'},
      },
    },
  },
}
