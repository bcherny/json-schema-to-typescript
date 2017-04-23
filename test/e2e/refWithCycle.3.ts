export let exclude = true

export const input = {
  additionalProperties: true,
  properties: {
    foo: {
      $ref: '#/definitions/bar'
    }
  },
  definitions: {
    bar: {
      $ref: '#/definitions/bar'
    }
  },
  required: ['foo'],
  title: 'Cycle (3)'
}

export const output = `export interface Cycle3 {
  foo: Foo;
}
`
