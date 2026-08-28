// An `allOf` member that leads back to the schema that owns the `allOf`: the schema
// itself (`$ref: '#'` at the root, `$ref: '#/definitions/viaSelf'` inside that
// definition), or a member whose property or array items are that schema.
// The owner is both an OBJECT and an ALL_OF, so it parses as an intersection, and
// each of these re-enters that intersection while it is still being built. Listing a
// schema in its own `allOf` adds no constraint, so that member is left out rather
// than printed as a circular alias (`type A = A & {...}`).
export const input = {
  title: 'AllOfSelfReference',
  type: 'object',
  properties: {
    label: {type: 'string'},
    viaProperty: {$ref: '#/definitions/viaProperty'},
    viaItems: {$ref: '#/definitions/viaItems'},
    viaSelf: {$ref: '#/definitions/viaSelf'},
  },
  allOf: [{$ref: '#'}],
  additionalProperties: false,
  definitions: {
    viaSelf: {
      type: 'object',
      properties: {label: {type: 'string'}},
      allOf: [{$ref: '#/definitions/viaSelf'}, {required: ['label']}],
      additionalProperties: false,
    },
    viaProperty: {
      type: 'object',
      properties: {label: {type: 'string'}},
      allOf: [{type: 'object', properties: {back: {$ref: '#/definitions/viaProperty'}}, additionalProperties: false}],
      additionalProperties: false,
    },
    viaItems: {
      type: 'object',
      properties: {label: {type: 'string'}},
      allOf: [
        {
          type: 'object',
          properties: {children: {type: 'array', items: {$ref: '#/definitions/viaItems'}}},
          additionalProperties: false,
        },
      ],
      additionalProperties: false,
    },
  },
}
