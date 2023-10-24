// Reported in #322
export const input = {
  type: 'object',
  title: 'Schema',
  description: 'Any Shape',
  additionalProperties: false,
  anyOf: [{$ref: 'test/resources/extends/Circle.json'}, {$ref: 'test/resources/extends/Square.json'}],
}
