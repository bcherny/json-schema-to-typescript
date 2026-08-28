// A definition that is nothing but a $ref to itself, reached only through
// `unreachableDefinitions` (nothing in the schema refers to it). Same tight,
// baseless cycle as refWithCycle.3, through the definitions-declaring path.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/745
export const input = {
  type: 'object',
  definitions: {
    Node1: {
      $ref: '#/definitions/Node1',
    },
  },
}

export const options = {
  unreachableDefinitions: true,
}

export const error = 'Failed to resolve $ref "#/definitions/Node1" in definition "Node1"'
