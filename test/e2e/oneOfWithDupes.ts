export const input = {
  title: 'Test',
  type: 'object',
  definitions: {
    a: {
      type: 'object',
      title: 'a',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
    b: {
      type: 'object',
      title: 'b',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
    c: {
      type: 'number',
      title: 'c',
    },
    d: {
      type: 'number',
    },
  },
  properties: {
    a: {
      oneOf: [{$ref: '#/definitions/a'}],
    },
    b: {
      oneOf: [{$ref: '#/definitions/a'}, {$ref: '#/definitions/b'}],
    },
    c: {
      oneOf: [{$ref: '#/definitions/c'}, {$ref: '#/definitions/d'}],
    },
    d: {
      oneOf: [{$ref: '#/definitions/c'}, {$ref: '#/definitions/c'}, {$ref: '#/definitions/d'}],
    },
    e: {
      oneOf: [{$ref: '#/definitions/d'}, {$ref: '#/definitions/d'}],
    },
    f: {
      oneOf: [
        {$ref: '#/definitions/a'},
        {$ref: '#/definitions/b'},
        {$ref: '#/definitions/c'},
        {$ref: '#/definitions/d'},
        {$ref: '#/definitions/a'},
        {$ref: '#/definitions/b'},
        {$ref: '#/definitions/c'},
        {$ref: '#/definitions/d'},
      ],
    },
  },
}
