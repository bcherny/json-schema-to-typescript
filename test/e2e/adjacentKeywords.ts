export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  anyOf: [
    {
      additionalProperties: false,
      properties: {
        a: {type: 'string'}
      }
    },
    {
      additionalProperties: false,
      properties: {
        b: {type: 'number'}
      }
    }
  ],
  properties: {
    c: {type: 'boolean'}
  }
}
