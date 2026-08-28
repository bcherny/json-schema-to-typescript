// `$defs` next to a validation keyword: the root is still `unknown`, and `unreachableDefinitions`
// declares what it hosts as before
export const input = {
  title: 'DefinitionsBundle',
  maxProperties: 8,
  $defs: {
    name: {type: 'string', minLength: 1},
    count: {type: 'integer'},
  },
}

export const options = {
  unreachableDefinitions: true,
}
