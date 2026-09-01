// A `const` (or an `enum` member) is printed as the literal type of its value, but for the empty
// object the two diverge: the value `{}` is only the empty object, while the type `{}` admits
// every non-nullish value (`43`, `"x"`, `[1]`, `{a: 1}`). So an empty object, on its own or
// anywhere inside a `const`/`enum` value, is spelled as the closed empty object type instead,
// the way `{type: 'object', additionalProperties: false}` already is. Other values are unchanged.
export const input = {
  title: 'ConstEmptyObject',
  type: 'object',
  properties: {
    empty: {const: {}},
    emptyOrName: {enum: [{}, 'none']},
    nested: {const: {options: {}, flags: [{}], name: 'x'}},
    tuple: {const: [{}]},
    control: {const: {a: 1, b: [true, null], c: 'x'}},
  },
  additionalProperties: false,
}
