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
    },
    bString: {
      const: ''
    },
    bNumber: {
      const: 0
    },
    bBoolean: {
      const: false
    },
    aNull: {
      const: null
    }
  },
  required: ['aString', 'aNumber', 'aBoolean', 'bString', 'bNumber', 'bBoolean', 'aNull']
}
