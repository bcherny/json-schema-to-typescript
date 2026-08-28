/**
 * Required-only members whose picked property leads back to the schema being parsed:
 * a recursive root (through a `oneOf` hop), a recursive definition, and a mutually
 * recursive pair. The pick re-enters the owner while its `allOf` is still being parsed.
 */
export const input = {
  title: 'Tree',
  type: 'object',
  properties: {
    value: {type: 'string'},
    children: {type: 'array', items: {$ref: '#'}},
    chain: {$ref: '#/definitions/chain'},
    ping: {$ref: '#/definitions/ping'},
  },
  allOf: [{oneOf: [{required: ['value']}, {required: ['children']}]}],
  additionalProperties: false,
  definitions: {
    chain: {
      type: 'object',
      properties: {v: {type: 'number'}, next: {$ref: '#/definitions/chain'}},
      allOf: [{required: ['next']}],
      additionalProperties: false,
    },
    ping: {
      type: 'object',
      properties: {pong: {$ref: '#/definitions/pong'}},
      allOf: [{required: ['pong']}],
      additionalProperties: false,
    },
    pong: {
      type: 'object',
      properties: {ping: {$ref: '#/definitions/ping'}},
      allOf: [{required: ['ping']}],
      additionalProperties: false,
    },
  },
}
