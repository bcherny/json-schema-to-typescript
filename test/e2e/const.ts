export const input = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    aString: {
      type: 'string',
      const: 'foo'
    },
    aNumber: {
      type: 'number',
      const: 5
    },
    aBoolean: {
      type: 'boolean',
      const: true
    }
  },
  required: ['aString', 'aNumber', 'aBoolean']
}
