// A root that only hosts definitions says nothing about instances: it is the empty schema,
// `unknown`, like `{}` -- not an object
export const input = {
  title: 'DefinitionsOnly',
  description: 'A bundle of definitions',
  definitions: {
    name: {type: 'string', minLength: 1},
  },
}
