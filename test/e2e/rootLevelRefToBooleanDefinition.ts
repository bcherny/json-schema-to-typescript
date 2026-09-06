// A root-level `$ref` that lands on a boolean schema keeps it as an `allOf` member of the root
// (`never` for `false`, `unknown` for `true`), where the ref parser would replace (v11) or fail
// to walk (v16) the whole document
export const input = {
  title: 'RootLevelRefToBooleanDefinition',
  definitions: {
    Never: false,
    Indirect: {$ref: '#/definitions/Never'},
  },
  $ref: '#/definitions/Indirect',
}
