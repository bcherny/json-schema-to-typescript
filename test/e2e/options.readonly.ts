// @see https://github.com/bcherny/json-schema-to-typescript/issues/627
// The `readonly` option marks every property and index signature `readonly` and every
// array and tuple type `readonly T[]`, whatever the schema's own `readOnly` annotations say.
export const input = {
  title: 'Readonly (configured to true)',
  type: 'object',
  definitions: {
    e: {
      type: 'object',
    },
    list: {
      title: 'List',
      type: 'array',
      items: {$ref: '#/definitions/e'},
    },
  },
  properties: {
    a: {
      type: 'object',
    },
    b: {
      type: 'object',
      properties: {nested: {type: 'string'}, matrix: {type: 'array', items: {type: 'array', items: {type: 'number'}}}},
      additionalProperties: {type: 'string'},
    },
    c: {type: 'string', readOnly: false, description: 'the option wins over `readOnly: false`'},
    d: {type: 'array', items: {type: 'string'}},
    pair: {type: 'array', minItems: 1, maxItems: 2, items: [{type: 'string'}, {type: 'number'}]},
    list: {$ref: '#/definitions/list'},
    byPattern: {
      title: 'ByPattern',
      type: 'object',
      patternProperties: {'^x-': {type: 'boolean'}},
      additionalProperties: false,
    },
  },
  required: ['a'],
}

export const options = {
  readonly: true,
}
