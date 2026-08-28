// An array whose items are a maxItems-bounded array. The item type renders as a
// union of tuples, so it must be parenthesized before `[]` is appended:
// `[] | [string] | [string, string][]` would make only the last member an array,
// rejecting schema-valid data such as [["a"], ["b"]].
export const input = {
  title: 'ArrayOfBoundedArrays',
  type: 'array',
  items: {
    type: 'array',
    maxItems: 2,
    items: {type: 'string'},
  },
}
