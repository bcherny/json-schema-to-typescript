// A `$ref` whose siblings add members to the referenced type (issue 613; see also ref.7.ts, the
// reporter's schema, and refWithSiblingKeywords.ts for annotation siblings). Since draft 2019-09
// the siblings apply alongside the reference, so `properties`, `required`, `oneOf`, `items`...
// next to a `$ref` are composed with it -- `Base & {...}` -- instead of being merged into a
// copy of the target that drops the target's own `properties`/`required` and takes its name.
// `title` names the composite; `description`, `default` and unknown keys stay with the property.
// Siblings that only restate or adjust the target (`type` alone, `enum`, `maxItems`) and
// `tsType` keep the merged copy, as before.
export const input = {
  title: 'RefWithExtendingSiblings',
  type: 'object',
  additionalProperties: false,
  definitions: {
    base: {
      title: 'Base',
      type: 'object',
      properties: {name: {type: 'string'}},
      required: ['name'],
    },
    tags: {type: 'array', items: {type: 'string'}},
    extensions: {patternProperties: {'^x-': {}}},
    // definitions that are themselves extended references: the inheritance pattern
    person: {
      title: 'Person',
      description: 'A Base with an age',
      $ref: '#/definitions/base',
      type: 'object',
      properties: {age: {type: 'number'}},
    },
    closedPerson: {
      $ref: '#/definitions/base',
      type: 'object',
      properties: {age: {type: 'number'}},
      unevaluatedProperties: false,
    },
    // schemars' internally tagged enum variant (issue 613, sgoll's comment)
    tagged: {
      oneOf: [
        {
          type: 'object',
          properties: {kind: {type: 'string', const: 'Struct'}},
          $ref: '#/definitions/base',
          required: ['kind'],
        },
        {type: 'string', const: 'Unit'},
      ],
    },
    // the OpenAPI 3.1 meta-schema's mixin pattern
    info: {
      $ref: '#/definitions/extensions',
      type: 'object',
      properties: {title: {type: 'string'}, version: {type: 'string'}},
      required: ['title'],
      unevaluatedProperties: false,
    },
  },
  properties: {
    person: {$ref: '#/definitions/person'},
    closedPerson: {$ref: '#/definitions/closedPerson'},
    tagged: {$ref: '#/definitions/tagged'},
    info: {$ref: '#/definitions/info'},
    // inline: the property is typed with the intersection and keeps its own comment
    inline: {
      $ref: '#/definitions/base',
      properties: {age: {type: 'number'}},
      description: 'An inline subtype',
      default: {name: 'x'},
      'x-order': 1,
    },
    moreRequired: {$ref: '#/definitions/base', required: ['nickname']},
    eitherKey: {$ref: '#/definitions/base', oneOf: [{required: ['x']}, {required: ['y']}]},
    // a sibling `allOf` is joined, not nested
    joined: {
      $ref: '#/definitions/base',
      allOf: [{properties: {x: {type: 'number'}}}],
      properties: {y: {type: 'number'}},
    },
    narrowerItems: {$ref: '#/definitions/tags', items: {enum: ['a', 'b']}},
    nullable: {$ref: '#/definitions/base', nullable: true, properties: {age: {type: 'number'}}},
    external: {$ref: 'test/resources/BaseType.1.json', properties: {middleName: {type: 'string'}}},
    // draft 3's boolean `required` flags the property; it extends nothing. Neither does an empty
    // list or map, which is dropped rather than merged into a copy (`required: []` there made
    // every property of the target optional)
    flagged: {$ref: '#/definitions/base', required: true},
    nothingRequired: {$ref: '#/definitions/base', required: []},
    noProperties: {$ref: '#/definitions/base', type: 'object', properties: {}},
    // left to the merged copy
    typeOnly: {$ref: '#/definitions/base', type: 'object'},
    atMostTwo: {$ref: '#/definitions/tags', maxItems: 2},
    overridden: {$ref: '#/definitions/base', properties: {age: {type: 'number'}}, tsType: 'Record<string, string>'},
  },
}
