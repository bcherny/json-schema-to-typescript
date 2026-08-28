// A named union that collapses to `unknown` (one member matches anything) is declared once,
// however many places reference it, and every referrer uses the name.
export const input = {
  title: 'ReferencedTwice',
  type: 'object',
  definitions: {
    loose: {
      description: 'A string, or anything',
      anyOf: [{}, {type: 'string'}],
    },
    identifier: {
      title: 'Identifier',
      oneOf: [{pattern: '^[a-z]+$'}, {type: 'integer'}],
    },
    nullableBound: {
      description: 'OpenAPI nullable next to a bound: a union with null once normalized',
      nullable: true,
      minimum: 0,
    },
    json: {
      description: 'Any JSON value',
      anyOf: [
        {type: 'null'},
        {type: 'boolean'},
        {type: 'number'},
        {type: 'string'},
        {type: 'array', items: {$ref: '#/definitions/json'}},
        {type: 'object', additionalProperties: {$ref: '#/definitions/json'}},
        {},
      ],
    },
  },
  properties: {
    a: {$ref: '#/definitions/loose'},
    b: {$ref: '#/definitions/loose'},
    c: {$ref: '#/definitions/identifier'},
    d: {$ref: '#/definitions/identifier'},
    e: {$ref: '#/definitions/json'},
    f: {type: 'array', items: {$ref: '#/definitions/json'}},
    g: {$ref: '#/definitions/nullableBound'},
    h: {$ref: '#/definitions/nullableBound'},
  },
  additionalProperties: false,
}
