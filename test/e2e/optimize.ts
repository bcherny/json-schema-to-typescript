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

export const output = `export interface OptimizableSchema {
  bar: (string | number);
  foo: any;
  [k: string]: any;
}
`
