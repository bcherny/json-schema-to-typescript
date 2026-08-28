// How a parent `type` narrows typed `anyOf`/`oneOf` members, one property per case.
export const input = {
  type: 'object',
  properties: {
    // `integer` is the whole-number part of `number`: both members stay
    integerUnderNumber: {type: 'number', anyOf: [{type: 'integer'}, {type: 'number', minimum: 0}]},
    numberUnderInteger: {type: 'integer', oneOf: [{type: 'number', maximum: 9}, {type: 'string'}]},
    // a member's type array is cut down to the types the parent admits
    typeArrayMember: {type: 'string', anyOf: [{type: ['string', 'null'], minLength: 1}, {type: 'number'}]},
    // no member admits the parent's type: nothing can match
    noMemberLeft: {type: 'object', anyOf: [{type: 'null'}]},
    // the bound carries through a member that is only typed by an `anyOf` of its own
    nestedCombinator: {
      type: 'object',
      oneOf: [{anyOf: [{type: 'string'}, {type: 'object', properties: {b: {type: 'boolean'}}}]}],
    },
    // a $ref'd definition whose type the parent rules out drops out here, and is left alone itself
    refToStringUnderObject: {type: 'object', anyOf: [{$ref: '#/definitions/str'}, {$ref: '#/definitions/obj'}]},
    // an array `type` is distributed over the members: each type keeps the members that admit
    // it, and a type no member admits (here `null` has one, `boolean` has none) goes
    typeArrayParent: {
      type: ['object', 'null', 'boolean'],
      oneOf: [{type: 'string'}, {type: 'null'}, {type: 'object', properties: {c: {type: 'string'}}}],
    },
    // untouched: untyped members under an `object` parent (the parser narrows required-only ones)
    requiredOnlyMembers: {
      type: 'object',
      properties: {d: {type: 'string'}, e: {type: 'string'}},
      oneOf: [{required: ['d']}, {required: ['e']}],
    },
  },
  definitions: {
    str: {type: 'string', title: 'Str'},
    obj: {type: 'object', title: 'Obj', properties: {o: {type: 'number'}}, additionalProperties: false},
  },
  additionalProperties: false,
}
