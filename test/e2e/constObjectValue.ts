// Pins today's output for object- and array-valued `const`s whose values happen to contain
// schema keywords. The value is printed as a literal type, after the normalizer has walked into
// it like any other unknown key: `extends` comes out wrapped in an array and `definitions`
// renamed to `$defs` (`enum` and `default` values are left alone). Kept here so that a change to
// how the normalizer walks the schema shows up as a snapshot change rather than going unnoticed.
export const input = {
  title: 'ConstObjectValue',
  type: 'object',
  properties: {
    tsconfig: {const: {cfg: {extends: './tsconfig.base.json', strict: true}}},
    presets: {const: [{extends: 'base'}]},
    defs: {const: [{definitions: {a: 1}}]},
    nested: {const: {x: {definitions: {a: {type: 'string'}}}}},
    choice: {enum: [{extends: 'base'}, {definitions: {a: 1}}]},
  },
  additionalProperties: false,
}

export const options = {
  format: false,
}
