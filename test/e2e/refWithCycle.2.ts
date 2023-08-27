export const input = {
  title: 'Cycle (2)',
  properties: {
    foo: {
      $ref: 'test/resources/cycle.3.json',
    },
  },
  required: ['foo'],
  additionalProperties: true,
}
