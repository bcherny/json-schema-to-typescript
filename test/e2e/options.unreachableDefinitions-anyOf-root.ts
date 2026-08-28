// @see https://github.com/bcherny/json-schema-to-typescript/issues/439 -- a compound (anyOf)
// root, whose definitions used to be dropped like every other non-object root's. `tree` is
// never referenced and has an anonymous self-referencing member (`children`), which has to
// be given a name of its own to be emitted at all.
export const input = {
  anyOf: [{type: 'string'}, {$ref: '#/definitions/shape'}],
  definitions: {
    shape: {
      type: 'object',
      properties: {kind: {type: 'string'}},
      additionalProperties: false,
    },
    tree: {
      type: 'object',
      properties: {
        value: {type: 'number'},
        children: {
          anyOf: [{type: 'null'}, {type: 'array', items: {$ref: '#/definitions/tree/properties/children'}}],
        },
      },
      additionalProperties: false,
    },
  },
}

export const options = {
  unreachableDefinitions: true,
}
