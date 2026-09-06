// `unevaluatedProperties` also counts what in-place applicators evaluate, so it can only be
// folded into `additionalProperties` where the emitted type covers those keys too (see the
// normalizer rule): the objects below marked "open" would otherwise reject spec-valid instances.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/442
export const input = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'UnevaluatedPropertiesApplicators',
  type: 'object',
  $defs: {
    base: {
      title: 'Base',
      type: 'object',
      properties: {name: {type: 'string'}},
    },
    namedWhenApiKey: {
      if: {properties: {type: {const: 'apiKey'}}},
      then: {properties: {name: {type: 'string'}}, required: ['name']},
    },
  },
  properties: {
    // open: {"kind": "a", "a": 1} is valid (`a` is evaluated by `then`)
    ifThenElse: {
      type: 'object',
      properties: {kind: {type: 'string'}},
      if: {properties: {kind: {const: 'a'}}},
      then: {properties: {a: {type: 'number'}}},
      else: {properties: {b: {type: 'number'}}},
      unevaluatedProperties: false,
    },
    // open: `if` alone contributes what it evaluated, {"foo": "x"} is valid
    ifOnly: {
      type: 'object',
      if: {patternProperties: {foo: {type: 'string'}}},
      unevaluatedProperties: false,
    },
    // open, the schema form too: {"a": "x", "b": true} is valid (`b` is evaluated by the
    // dependent schema)
    dependentSchemas: {
      type: 'object',
      properties: {a: {type: 'string'}},
      dependentSchemas: {a: {properties: {b: {type: 'boolean'}}}},
      unevaluatedProperties: {type: 'number'},
    },
    // open: {"name": "x", "age": 1} is valid; the ref resolver merges the two `properties` (issue 613)
    refWithSiblingProperties: {
      $ref: '#/$defs/base',
      title: 'Person',
      type: 'object',
      properties: {age: {type: 'number'}},
      unevaluatedProperties: false,
    },
    // open: the security-scheme pattern from the OpenAPI 3.1 meta-schema. The member parses
    // as `{}` and is left out of the intersection, so {"type": "apiKey", "name": "x"} needs
    // the index signature
    allOfConditionalMember: {
      type: 'object',
      properties: {type: {enum: ['apiKey', 'http']}},
      required: ['type'],
      allOf: [
        {
          if: {properties: {type: {const: 'apiKey'}}},
          then: {properties: {name: {type: 'string'}}, required: ['name']},
        },
      ],
      unevaluatedProperties: false,
    },
    // open: the same through a `$ref` and one level further down
    allOfNestedConditionalMember: {
      type: 'object',
      properties: {type: {enum: ['apiKey', 'http']}},
      required: ['type'],
      allOf: [{allOf: [{$ref: '#/$defs/namedWhenApiKey'}]}],
      unevaluatedProperties: false,
    },
    // open: whatever `#node` resolves to at runtime evaluates keys too
    dynamicRef: {
      type: 'object',
      properties: {extra: {type: 'number'}},
      $dynamicRef: '#node',
      unevaluatedProperties: false,
    },
    // closed: the members are emitted and intersected with {own?: string}, and
    // {"own": "x", "x": 1} satisfies that intersection whether or not {own?: string}
    // carries an index signature
    anyOf: {
      type: 'object',
      properties: {own: {type: 'string'}},
      anyOf: [
        {properties: {x: {type: 'number'}}, required: ['x']},
        {properties: {y: {type: 'number'}}, required: ['y']},
      ],
      unevaluatedProperties: false,
    },
    oneOf: {
      type: 'object',
      properties: {own: {type: 'string'}},
      oneOf: [{$ref: '#/$defs/base'}, {properties: {y: {type: 'number'}}, required: ['y']}],
      unevaluatedProperties: false,
    },
    allOf: {
      type: 'object',
      properties: {own: {type: 'string'}},
      allOf: [{$ref: '#/$defs/base'}],
      unevaluatedProperties: false,
    },
    // open: a schema (rather than `false`) would become a typed index signature on
    // {own?: boolean}, and the intersection holds the member's `x` to it: {"x": 1} is valid
    anyOfSchemaForm: {
      type: 'object',
      properties: {own: {type: 'boolean'}},
      anyOf: [{properties: {x: {type: 'number'}}, required: ['x']}],
      unevaluatedProperties: {type: 'string'},
    },
    // closed, as in #782: every property is declared inline (the schema form types the index
    // signature)
    plain: {
      type: 'object',
      properties: {own: {type: 'string'}},
      unevaluatedProperties: false,
    },
    plainSchemaForm: {
      type: 'object',
      properties: {own: {type: 'string'}},
      unevaluatedProperties: {type: 'string'},
    },
  },
  additionalProperties: false,
}
