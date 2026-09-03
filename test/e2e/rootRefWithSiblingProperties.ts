// A root schema that is a `$ref` with sibling `properties` is the referenced type extended,
// like any other schema of that shape (issue 613): `Root = Base & {age?: number}`, not a merge
// of the two that keeps one side's `properties`.
export const input = {
  title: 'Root',
  $ref: '#/definitions/base',
  type: 'object',
  properties: {age: {type: 'number'}},
  required: ['age'],
  definitions: {
    base: {
      title: 'Base',
      type: 'object',
      properties: {name: {type: 'string'}},
      required: ['name'],
    },
  },
}
