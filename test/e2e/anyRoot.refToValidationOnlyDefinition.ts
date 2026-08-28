// A root `$ref` to a definition with no type-shaping keyword resolves to `unknown` too: the
// `$defs` the dereferenced root still carries don't make it an object
export const input = {
  title: 'RefToValidationOnlyDefinition',
  $ref: '#/$defs/positive',
  $defs: {
    positive: {minimum: 1},
  },
}
