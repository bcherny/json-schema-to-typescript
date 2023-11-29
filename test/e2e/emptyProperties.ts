export const input = {
  definitions: {
    b: {},
  },
  properties: {
    a: {},
    b: {$ref: '#/definitions/b'},
  },
}
