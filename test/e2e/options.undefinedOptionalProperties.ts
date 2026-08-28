// https://github.com/bcherny/json-schema-to-typescript/issues/604
export const input = {
  title: 'UndefinedOptionalProperties',
  type: 'object',
  definitions: {
    shared: {
      title: 'Shared',
      type: 'object',
      properties: {
        maybe: {type: 'string'},
      },
      additionalProperties: false,
    },
    color: {
      title: 'Color',
      enum: ['red', 'green'],
    },
  },
  properties: {
    maybe: {
      type: 'string',
    },
    definitely: {
      type: 'string',
    },
    complex: {
      type: 'object',
      properties: {
        maybe: {
          type: 'string',
        },
      },
      additionalProperties: {
        title: 'Leaf',
        type: 'object',
        properties: {
          maybe: {
            type: 'string',
          },
        },
      },
    },
    list: {
      type: 'array',
      items: {type: 'number'},
    },
    pair: {
      type: 'array',
      items: [{type: 'string'}, {type: 'number'}],
      minItems: 2,
    },
    union: {
      type: ['string', 'number'],
    },
    nullable: {
      type: ['string', 'null'],
    },
    ref: {
      $ref: '#/definitions/shared',
    },
    color: {
      $ref: '#/definitions/color',
    },
    callback: {
      tsType: '() => void',
    },
    custom: {
      tsType: 'Set<string>',
    },
    anything: {},
    withDefault: {
      type: 'boolean',
      default: true,
    },
    /** already includes undefined: left as written */
    explicit: {
      tsType: 'string | undefined',
    },
  },
  patternProperties: {
    '^x-': {type: 'string'},
  },
  required: ['definitely'],
}

export const options = {
  undefinedOptionalProperties: true,
}
