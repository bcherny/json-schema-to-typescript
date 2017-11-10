export const input = {
  properties: {
    bar: {
      anyOf: [
        { type: 'string' },
        { type: 'string' },
        { type: 'integer' },
        { type: 'string' }
      ]
    },
    foo: {
      anyOf: [
        { type: 'string' },
        { type: 'any' },
        { type: 'integer' }
      ]
    }
  },
  required: ['bar', 'foo'],
  title: 'Optimizable Schema',
  type: 'object'
}
