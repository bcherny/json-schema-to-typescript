export const input = {
  title: 'EnumInUnnamedPosition',
  type: 'object',
  properties: {
    // An anyOf branch supplies no key name and has no title, so there is no name
    // available for an enum declaration. This must degrade to a union of literals
    // rather than emit a nameless `export enum { ... }`, which does not compile.
    unnamed: {
      anyOf: [{type: 'string', enum: ['a', 'b'], tsEnumNames: ['A', 'B']}, {type: 'number'}],
    },
    // Control: a branch that does carry a title still produces a real enum.
    named: {
      anyOf: [{type: 'string', enum: ['c', 'd'], title: 'NamedBranch', tsEnumNames: ['C', 'D']}, {type: 'number'}],
    },
  },
  required: ['unnamed', 'named'],
  additionalProperties: false,
}
