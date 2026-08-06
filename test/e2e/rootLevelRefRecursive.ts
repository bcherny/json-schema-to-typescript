// A root-level `$ref` whose target is self-referencing.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/730
export const input = {
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
