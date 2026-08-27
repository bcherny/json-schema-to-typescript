/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/745
 * A definition whose only content is a $ref to itself. json-schema-ref-parser
 * leaves it as a literal {$ref} object, so with unreachableDefinitions the
 * parser hits "Refs should have been resolved by the resolver!".
 */
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Node1: {$ref: '#/definitions/Node1'},
  },
}

export const options = {
  unreachableDefinitions: true,
}
