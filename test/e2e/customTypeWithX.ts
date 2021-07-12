export const input = {
  title: 'CustomType',
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      'x-tsType': 'Set<number|string>'
    },
    bar: {
      description: 'Comparator function',
      instanceOf: 'Function',
      'x-tsType': '(a: number, b: number) => number'
    },
    foobar: {$ref: '#/definitions/foobar'}
  },
  definitions: {
    foobar: {
      description: 'Map from number to string',
      tsType: 'Map<number, string>'
    }
  },
  additionalProperties: false
}
