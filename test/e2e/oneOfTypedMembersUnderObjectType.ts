// A parent `type` bounds every `oneOf` member: the `string` member can never match an
// object, so it drops out instead of making the whole schema admit strings.
export const input = {
  type: 'object',
  oneOf: [{type: 'string'}, {type: 'object', properties: {a: {type: 'string'}}}],
}
