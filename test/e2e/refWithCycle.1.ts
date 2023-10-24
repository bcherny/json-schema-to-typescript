export const input = {
  title: 'Local Cycle',
  properties: {
    foo: {
      $ref: '#',
    },
    bar: {
      $ref: '#',
    },
  },
  required: ['foo'],
  additionalProperties: true,
}
