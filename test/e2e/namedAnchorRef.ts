// @see https://github.com/bcherny/json-schema-to-typescript/issues/220
export const input = {
  $id: '#myName',
  properties: {
    myProp: {$ref: '#myName'},
  },
}
