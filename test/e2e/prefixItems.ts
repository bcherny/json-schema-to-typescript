// https://github.com/bcherny/json-schema-to-typescript/issues/543
// Draft 2020-12 tuples: `prefixItems` is what the array form of `items` used to be, and next
// to it `items` means what `additionalItems` used to. Each property below should compile
// exactly like its draft 4 spelling would.
export const input = {
  title: 'PrefixItems',
  type: 'object',
  definitions: {
    id: {title: 'Id', type: 'string'},
  },
  properties: {
    closed: {
      type: 'array',
      prefixItems: [{type: 'number'}, {type: 'string'}],
      items: false,
      minItems: 2,
    },
    closedOptional: {
      type: 'array',
      prefixItems: [{type: 'number'}, {type: 'string'}],
      items: false,
    },
    open: {
      type: 'array',
      prefixItems: [{type: 'number'}, {type: 'string'}],
      minItems: 1,
    },
    openExplicit: {
      type: 'array',
      prefixItems: [{type: 'number'}, {type: 'string'}],
      items: true,
      minItems: 2,
    },
    typedRest: {
      type: 'array',
      prefixItems: [{$ref: '#/definitions/id'}, {enum: ['a', 'b']}],
      items: {type: 'boolean'},
      minItems: 2,
    },
    bounded: {
      type: 'array',
      prefixItems: [{type: 'number'}],
      items: {type: 'string'},
      minItems: 1,
      maxItems: 3,
    },
    untyped: {
      prefixItems: [{type: 'integer'}, {type: 'integer'}],
      items: false,
      minItems: 2,
      description: 'no `type`: `prefixItems` alone makes this an array',
    },
    nested: {
      type: 'array',
      prefixItems: [
        {
          type: 'array',
          prefixItems: [{type: 'boolean'}],
          items: false,
          minItems: 1,
        },
      ],
      items: false,
      minItems: 1,
    },
    draft4: {
      type: 'array',
      items: [{type: 'number'}, {type: 'string'}],
      additionalItems: false,
      minItems: 2,
      description: 'the draft 4 spelling of `closed`, for comparison',
    },
    draft4List: {
      type: 'array',
      items: {type: 'number'},
      description: '`items` without `prefixItems` keeps its list meaning',
    },
  },
  additionalProperties: false,
}
