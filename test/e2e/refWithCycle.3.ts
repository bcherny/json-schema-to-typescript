export let exclude = true

export const input = {
  additionalProperties: true,
  properties: {
    foo: {
      $ref: '#/definitions/bar',
    },
  },
  definitions: {
    bar: {
      $ref: '#/definitions/bar',
    },
  },
  required: ['foo'],
  title: 'Cycle (3)',
}
