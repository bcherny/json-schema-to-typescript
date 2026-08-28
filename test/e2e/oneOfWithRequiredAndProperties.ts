// https://github.com/bcherny/json-schema-to-typescript/issues/630
export const input = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    cardDataResponse: {
      type: 'object',
      properties: {
        emvAppData: {type: 'string'},
        ctlessEmvAppData: {type: 'string'},
      },
      oneOf: [{required: ['emvAppData']}, {required: ['ctlessEmvAppData']}],
    },
  },
  required: ['cardDataResponse'],
}
