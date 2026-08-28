// A root (or definition) whose `anyOf`/`oneOf`/`allOf` matches anything -- a member is the empty
// schema, or every member only bounds values without giving them a type -- collapses to
// `unknown` in the optimizer. It used to lose its name and comment on the way and compile to an
// empty file; it is declared as an alias instead.
export const input = {
  title: 'UnionOfValidationOnly',
  description: 'Either spelling of an identifier',
  oneOf: [{pattern: '^[a-z-]+$'}, {pattern: '^[A-Z_]+$'}, {type: 'integer'}],
}
