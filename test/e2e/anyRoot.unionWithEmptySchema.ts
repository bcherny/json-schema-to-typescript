// A root `anyOf` with an empty member matches anything and collapses to `unknown` in the
// optimizer, which used to drop the root name and comment with it and compile to an empty file
export const input = {
  title: 'UnionWithEmptySchema',
  description: 'A string, or anything',
  anyOf: [{type: 'string'}, {}],
}
