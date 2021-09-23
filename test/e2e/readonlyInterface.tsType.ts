export const input = {
  type: 'object',
  required: ['a'],
  properties: {
    a: {
      tsType: 'MyCustomType',
			tsReadonlyProperty: true
    }
  },
  additionalProperties: false
}
