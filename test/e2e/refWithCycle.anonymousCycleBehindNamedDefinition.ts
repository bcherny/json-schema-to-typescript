/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/482
 * Anonymous schemas under `components/schemas` form a cycle (v -> object -> u ->
 * array -> v) that is first reached through a second, harmless cycle running through
 * the named definition `n` (v -> n -> u -> array -> v). Naming recursive types has
 * to look past the named definition to find the cycle that still has no name on it.
 */
export const input = {
  type: 'object',
  additionalProperties: false,
  properties: {
    p: {$ref: '#/components/schemas/v'},
  },
  definitions: {
    n: {anyOf: [{type: 'boolean'}, {$ref: '#/components/schemas/u'}]},
  },
  components: {
    schemas: {
      v: {
        anyOf: [
          {$ref: '#/definitions/n'},
          {type: 'object', additionalProperties: false, properties: {u: {$ref: '#/components/schemas/u'}}},
        ],
      },
      u: {anyOf: [{type: 'string'}, {type: 'array', items: {$ref: '#/components/schemas/v'}}]},
    },
  },
}
