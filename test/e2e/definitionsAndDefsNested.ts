// `definitions` and `$defs` side by side are accepted when they are deep-equal and rejected
// otherwise. Here they sit on a nested schema, and one member is also reached earlier in the
// walk through a sibling's `$ref`; pins that this still compiles (the comparison must not see
// one side half-normalized).
export const input = {
  title: 'DefinitionsAndDefsNested',
  type: 'object',
  properties: {
    p: {$ref: '#/properties/holder/$defs/X'},
    holder: {
      type: 'object',
      definitions: {X: {const: 1}},
      $defs: {X: {const: 1}},
      properties: {q: {$ref: '#/properties/holder/$defs/X'}},
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}
