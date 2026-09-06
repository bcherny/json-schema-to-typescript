// A property (or definition) that happens to be named like a JSON-Schema keyword -- `properties`,
// `required`, `enum`, `not`, `definitions` -- holds a schema like any other: it gets the name
// its `$ref` or draft-04 `id` gives it, the same as under any other property name, and whether
// it or another use of the same schema is written first.
export const input = {
  type: 'object',
  definitions: {
    group: {
      definitions: {
        required: {type: 'object', properties: {b: {type: 'number'}}},
      },
    },
  },
  properties: {
    // a (non-root) definition first used under a property named `properties`: named after the
    // definition, like everywhere else it is used
    properties: {$ref: '#/properties/config/definitions/settings'},
    config: {
      type: 'object',
      definitions: {
        settings: {type: 'object', properties: {a: {type: 'string'}}, additionalProperties: false},
      },
      properties: {current: {$ref: '#/properties/config/definitions/settings'}},
    },
    // a draft-04 `id` names the type
    enum: {id: 'Choice', type: 'object', properties: {c: {type: 'boolean'}}},
    // a nested definition itself named like a keyword, referenced twice: declared once, by its name
    x: {$ref: '#/definitions/group/definitions/required'},
    y: {$ref: '#/definitions/group/definitions/required'},
    // the same schema under a keyword-named property and at ordinary positions: one named type
    not: {type: 'object', properties: {d: {type: 'integer'}}, additionalProperties: false},
  },
  additionalProperties: {$ref: '#/properties/not'},
  patternProperties: {'^z': {$ref: '#/properties/not'}},
}
