export const input = {
  $schema: 'http://json-schema.org/schema#',
  definitions: {
    grocery: {
      type: 'object',
      minProperties: 1,
      maxProperties: 1
    }
  },
  type: 'object',
  properties: {
    grocery: {$ref: '#/definitions/grocery'}
  },
  additionalProperties: false,
  'x-name': 'GroceryList'
}
