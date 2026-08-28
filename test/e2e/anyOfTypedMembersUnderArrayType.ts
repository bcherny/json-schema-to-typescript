// Under an `array` parent the `string` member drops out and the untyped `items` member is
// the array (the parent's own `unknown[]` reading stays intersected in, as before).
export const input = {
  type: 'array',
  anyOf: [{type: 'string'}, {items: {type: 'number'}}],
}
