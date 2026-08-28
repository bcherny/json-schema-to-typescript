export const input = {
  title: 'Referencing a boolean subschema',
  definitions: {
    Never: false,
  },
  properties: {
    foo: {
      $ref: '#/definitions/Never',
    },
  },
}
