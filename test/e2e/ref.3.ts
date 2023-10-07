// TODO: why does this test fail? do we need to send a specific User-Agent header to github?
export let exclude = true

export const input = {
  title: 'Referencing3',
  type: 'object',
  properties: {
    foo: {
      $ref: 'https://raw.githubusercontent.com/bcherny/json-schema-to-typescript/4531fd7da2c2dbed3b2887fd7035ff18573edb82/test/resources/ReferencedType.json',
    },
  },
  required: ['foo'],
  additionalProperties: false,
}
