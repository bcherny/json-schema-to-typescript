// A property, definition, pattern or dependency key spelled `hasOwnProperty` is a key like any
// other (the object holding it has a schema where its `hasOwnProperty` method was).
export const input = {
  type: 'object',
  properties: {
    hasOwnProperty: {type: 'string'},
    nested: {
      type: 'object',
      properties: {hasOwnProperty: {$ref: '#/definitions/hasOwnProperty'}},
      patternProperties: {hasOwnProperty: {type: 'boolean'}},
      dependencies: {hasOwnProperty: ['other']},
    },
    choice: {enum: [{hasOwnProperty: 1}, 'plain']},
  },
  definitions: {hasOwnProperty: {type: 'number'}},
  additionalProperties: false,
}
