// A `$ref` with a sibling `type` is dereferenced into a shallow copy of its target, so the
// copy's `oneOf` list is the definition's own: constraining it by the sibling `type` must give
// the copy a list of its own and leave `D` (and every plain `$ref` to it) with both members.
export const input = {
  type: 'object',
  properties: {
    plain: {$ref: '#/definitions/d'},
    objectOnly: {$ref: '#/definitions/d', type: 'object'},
    nullable: {$ref: '#/definitions/e', type: ['object', 'null']},
    plainE: {$ref: '#/definitions/e'},
  },
  definitions: {
    d: {oneOf: [{type: 'string'}, {type: 'object', properties: {a: {type: 'string'}}}]},
    e: {anyOf: [{type: 'string'}, {type: 'null'}, {type: 'object', properties: {b: {type: 'string'}}}]},
  },
  additionalProperties: false,
}
