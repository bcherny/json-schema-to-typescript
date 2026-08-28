// Applicators this tool does not implement -- `not`, `if`/`then`/`else`, `dependencies` -- decide
// which values validate, never which type they are: a schema with nothing else that shapes a type
// is `unknown` like the empty schema (see anyForValidationOnlySchemas.ts), not an object. Next to
// a keyword that does give a type, or as one `allOf` member among others that do, they change
// nothing; a definition made of them keeps its name, as an alias for `unknown`. Likewise
// `additionalItems` with no tuple `items` for it to extend; not so `unevaluatedProperties`, which
// stands in for `additionalProperties` (unevaluatedProperties.ts) and so implies an object.
export const input = {
  title: 'AnyForUnimplementedApplicators',
  type: 'object',
  definitions: {
    notNull: {
      description: 'Anything but null',
      not: {type: 'null'},
    },
  },
  properties: {
    not: {not: {type: 'null'}},
    describedNot: {description: 'Not a string', not: {type: 'string'}},
    ifThenElse: {
      if: {type: 'string'},
      then: {minLength: 1},
      else: {type: 'number'},
    },
    dependencies: {dependencies: {a: ['b'], c: {required: ['d']}}},
    typedNot: {type: 'string', not: {enum: ['']}},
    objectWithIf: {
      type: 'object',
      properties: {kind: {type: 'string'}},
      if: {properties: {kind: {const: 'a'}}},
      then: {required: ['a']},
    },
    inAllOf: {allOf: [{not: {type: 'null'}}, {type: 'number'}]},
    inAllOfWithRequired: {
      description: 'What is left once the `not` members are set aside is an object that requires `a`',
      required: ['a'],
      allOf: [{not: {required: ['b']}}, {not: {required: ['c']}}],
    },
    allOfOnlyThese: {allOf: [{not: {type: 'null'}}, {if: {type: 'string'}, then: {maxLength: 3}}]},
    besideRequiredOnlyMembers: {
      description: 'The `oneOf` members still find `a` and `b` declared next to the `allOf`',
      type: 'object',
      properties: {a: {type: 'string'}, b: {type: 'number'}},
      allOf: [{not: {required: ['c']}}, {oneOf: [{required: ['a']}, {required: ['b']}]}],
    },
    viaRef: {$ref: '#/definitions/notNull'},
    viaRefInAllOf: {allOf: [{$ref: '#/definitions/notNull'}]},
    viaRefAmongOthers: {allOf: [{$ref: '#/definitions/notNull'}, {type: 'string'}]},
    additionalItemsOnly: {additionalItems: {type: 'string'}},
    unevaluatedPropertiesOnly: {unevaluatedProperties: false},
  },
  additionalProperties: false,
}
