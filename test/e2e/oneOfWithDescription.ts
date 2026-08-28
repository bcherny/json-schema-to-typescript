// https://github.com/bcherny/json-schema-to-typescript/issues/419
export const input = {
  title: 'QueryMsg',
  oneOf: [
    {
      description: 'This is variant 1',
      type: 'object',
      required: ['kind'],
      properties: {kind: {type: 'string', enum: ['variant_1']}},
    },
  ],
}
