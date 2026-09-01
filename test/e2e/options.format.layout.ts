// The layout of unformatted (`format: false`) output: members indented by depth and ended with
// `;`, a union too long for its line written a member per line, and parentheses only where an
// array, union or intersection needs them around a member. One property per context in which a
// type can be embedded; the `typecheck` twin of this case proves the result parses.
export const input = {
  title: 'Layout',
  description: 'First line.\n\nAfter a blank line.',
  type: 'object',
  definitions: {
    named: {
      title: 'Named',
      description: 'A named interface',
      type: 'object',
      properties: {a: {type: 'string'}},
      additionalProperties: false,
    },
    color: {title: 'Color', type: 'string', enum: ['red', 'green', 'blue']},
    level: {title: 'Level', enum: ['low', 1], tsEnumNames: ['Low', 'One']},
  },
  properties: {
    shortUnion: {type: ['string', 'number']},
    longUnion: {type: 'string', enum: Array.from({length: 12}, (_, i) => `option-number-${i + 1}`)},
    unionWithObject: {
      oneOf: [{type: 'string'}, {type: 'object', properties: {b: {type: 'boolean'}}, additionalProperties: false}],
    },
    commentedMembers: {
      anyOf: [
        {$ref: '#/definitions/named'},
        {description: 'An anonymous member', type: 'object', properties: {c: {type: 'integer'}}},
        {description: 'Another', type: 'object', properties: {d: {type: 'integer'}}},
      ],
    },
    arrayOfUnion: {type: 'array', items: {type: ['string', 'number']}},
    arrayOfLongUnion: {type: 'array', items: {enum: Array.from({length: 12}, (_, i) => `item-number-${i + 1}`)}},
    arrayOfIntersection: {
      type: 'array',
      items: {allOf: [{$ref: '#/definitions/named'}, {type: 'object', properties: {e: {type: 'string'}}}]},
    },
    arrayOfObject: {type: 'array', items: {type: 'object', properties: {f: {type: 'string'}}}},
    arrayOfStringLiteral: {type: 'array', items: {type: 'string', enum: ['only']}},
    arrayOfArrays: {type: 'array', items: {type: 'array', items: {type: ['string', 'null']}}},
    tuple: {
      type: 'array',
      items: [{type: 'string'}, {type: ['number', 'null']}],
      minItems: 2,
      additionalItems: false,
    },
    tupleWithOptionalItems: {
      type: 'array',
      items: [{type: 'string'}, {type: 'object', properties: {g: {type: 'string'}}, additionalProperties: false}],
      minItems: 0,
    },
    unionOfTupleAndString: {
      anyOf: [{type: 'array', items: [{type: 'string'}], minItems: 0}, {type: 'string'}],
    },
    intersection: {
      allOf: [{$ref: '#/definitions/named'}, {type: 'object', properties: {h: {type: 'string'}}, required: ['h']}],
    },
    intersectionOfUnions: {
      allOf: [{type: ['string', 'number']}, {enum: ['x', 1]}],
    },
    longIntersection: {
      allOf: Array.from({length: 6}, (_, i) => ({$ref: `#/definitions/member${i + 1}`})),
    },
    nested: {
      type: 'object',
      properties: {
        deeper: {
          type: 'object',
          description: 'Two levels down',
          properties: {deepest: {type: 'array', items: {type: 'boolean'}, minItems: 1}},
          additionalProperties: false,
        },
      },
      additionalProperties: {type: 'number'},
    },
    constObject: {const: {key: 'value', 'needs-quotes': [1, 'two', null], nested: {empty: {}}}},
    constString: {const: 'fixed'},
    enumRef: {$ref: '#/definitions/color'},
    tsEnumRef: {$ref: '#/definitions/level'},
    custom: {tsType: 'Record<string, () => void>'},
    // a `tsType`'s own lines keep their columns: inside a template literal they are part of the type
    customMultiline: {
      type: 'object',
      properties: {template: {tsType: '`first line\n  second line ${string}\nthird`'}},
      additionalProperties: false,
    },
    // the lone `oneOf` branch's comment goes before the `|`, as any member's
    singleMemberFirst: {
      anyOf: [
        {oneOf: [{description: 'Only branch', type: 'object', properties: {i: {type: 'string'}}}]},
        {type: 'number'},
      ],
    },
    // ... in a widened index signature too
    widenedIndexSignature: {
      type: 'object',
      properties: {q: {type: 'string'}},
      patternProperties: {
        '^p': {allOf: [{description: 'Only branch', type: 'object', properties: {i: {type: 'string'}}}]},
      },
    },
    // ... and when the member is an array (of arrays) of that branch
    arrayOfSingleMemberFirst: {
      anyOf: [
        {
          type: 'array',
          items: {
            type: 'array',
            items: {oneOf: [{description: 'Only branch', type: 'object', properties: {j: {type: 'string'}}}]},
          },
        },
        {type: 'number'},
      ],
    },
    arrayInWidenedIndexSignature: {
      type: 'object',
      properties: {q: {type: 'string'}},
      patternProperties: {
        '^p': {
          type: 'array',
          items: {oneOf: [{description: 'Only branch', type: 'object', properties: {j: {type: 'string'}}}]},
        },
      },
    },
    // ... also below a tuple, where nothing else renders the members first
    tupleOfSingleMemberFirst: {
      type: 'array',
      minItems: 1,
      items: {
        anyOf: [
          {
            type: 'array',
            items: {oneOf: [{description: 'Only branch', type: 'object', properties: {l: {type: 'string'}}}]},
          },
          {type: 'number'},
        ],
      },
    },
    tupleRestOfSingleMemberFirst: {
      type: 'array',
      items: [{type: 'string'}],
      additionalItems: {
        anyOf: [
          {oneOf: [{description: 'Only branch', type: 'object', properties: {m: {type: 'string'}}}]},
          {type: 'number'},
        ],
      },
    },
    // a described `const` or inline `enum` branch has its comment before its `|` too; an array of a
    // described string literal keeps the comment inside its parentheses (a `readonly` one after `readonly`)
    describedLiteralMembers: {
      anyOf: [
        {const: 'one', description: 'First choice'},
        {enum: ['two', 'three'], description: 'The others'},
        {type: 'array', items: {oneOf: [{const: 'el', description: 'Element'}]}},
        {type: 'array', items: {oneOf: [{const: 4, description: 'Four'}]}},
        {type: 'array', items: {oneOf: [{enum: [5, 6], description: 'Five or six'}]}},
        {type: 'number'},
      ],
    },
    // in an `allOf` as well, also with `| undefined` after it (the type-style twin)
    describedEnumInAllOf: {allOf: [{enum: ['on', 'off'], description: 'Either'}]},
    // a described `enum` too long for a line brings its own lines; its comment goes right above them
    describedLongEnum: {
      type: 'array',
      items: {oneOf: [{enum: Array.from({length: 8}, (_, i) => `enum-member-value-${i}`), description: 'Many'}]},
    },
    // a `tsType` that would not parse behind a `|` is parenthesized, and the union laid out like any other
    customInLongUnion: {
      anyOf: [
        {tsType: '(event: string) => void'},
        ...Array.from({length: 6}, (_, i) => ({$ref: `#/definitions/member${i + 1}`})),
      ],
    },
    // a rest type keeps its parentheses unless it plainly needs none
    tupleWithCustomRest: {
      type: 'array',
      items: [{type: 'string'}],
      additionalItems: {tsType: 'keyof Named'},
      minItems: 1,
    },
    tupleWithNamedRest: {
      type: 'array',
      items: [{type: 'string'}],
      additionalItems: {$ref: '#/definitions/named'},
      minItems: 1,
    },
    empty: {type: 'object', additionalProperties: false},
  },
  required: ['shortUnion', 'nested'],
  additionalProperties: false,
}
for (let i = 1; i <= 6; i++) {
  ;(input.definitions as Record<string, unknown>)[`member${i}`] = {
    title: `IntersectionMemberNumber${i}`,
    type: 'object',
    properties: {[`m${i}`]: {type: 'string'}},
  }
}

export const options = {
  format: false,
}
