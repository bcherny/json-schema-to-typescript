// A `$ref` with sibling keywords (see also refWithSiblingDescription.ts, issue 193's own
// schema). Siblings this tool derives no type from -- `description`, `title`, `default`,
// `examples`, `$comment`, `deprecated`, `readOnly`, validation keywords TypeScript can't
// express, editor and vendor keys -- annotate the property and leave the reference pointing
// at the one named type: `description` and `deprecated` become the property's JSDoc and a
// `title` is dropped (it labels the property, which has no rendering). Siblings that restate
// or adjust the target's type (`type`, `maxItems`, `enum`, `tsType`, ...) still produce the
// resolver's merged copy, as before; siblings that extend it (`properties`, `required`,
// `oneOf`...) are refWithExtendingSiblings.ts.
export const input = {
  title: 'RefWithSiblingKeywords',
  type: 'object',
  additionalProperties: false,
  definitions: {
    money: {
      title: 'Money',
      description: 'An amount in minor units',
      type: 'object',
      properties: {
        amount: {type: 'integer'},
        currency: {$ref: '#/definitions/currency', description: 'ISO 4217 code'},
      },
      required: ['amount', 'currency'],
      additionalProperties: false,
    },
    currency: {type: 'string', enum: ['EUR', 'USD']},
    level: {type: 'string', enum: ['low', 'high'], tsEnumNames: ['Low', 'High']},
    id: {type: 'string', format: 'uuid'},
    tags: {type: 'array', items: {type: 'string'}},
    // a definition that is itself an annotated reference: an alias, declared once
    price: {$ref: '#/definitions/money', description: 'Money by another name'},
  },
  required: ['total'],
  properties: {
    // one `Money`, each property with its own comment
    total: {$ref: '#/definitions/money', description: 'Grand total'},
    tax: {$ref: '#/definitions/money', description: 'Tax component', deprecated: true},
    net: {$ref: '#/definitions/money'},
    labelled: {$ref: '#/definitions/money', title: 'Net Amount'},
    documented: {
      $ref: '#/definitions/money',
      title: 'Gross',
      description: 'Labelled, described and exemplified',
      examples: [{amount: 100, currency: 'EUR'}],
      $comment: 'reviewed',
    },
    readOnlyId: {$ref: '#/definitions/id', readOnly: true, description: 'Assigned by the server'},
    constrainedId: {$ref: '#/definitions/id', minLength: 36, pattern: '^[0-9a-f-]+$'},
    vendor: {$ref: '#/definitions/money', 'x-display': 'currency', markdownDescription: '**Rich** text'},
    levelWithDefault: {$ref: '#/definitions/level', default: 'low', description: 'A TypeScript enum'},
    settlementCurrency: {$ref: '#/definitions/currency', description: 'Settlement currency'},
    tagged: {$ref: '#/definitions/tags', description: 'Free-form tags'},
    price: {$ref: '#/definitions/price'},
    legacyRequired: {$ref: '#/definitions/id', required: true, description: 'draft 3 style required'},
    // other positions: array items, additionalProperties, a oneOf branch
    lines: {type: 'array', items: {$ref: '#/definitions/money', description: 'One per line'}},
    perKey: {type: 'object', additionalProperties: {$ref: '#/definitions/money', description: 'Keyed by account'}},
    either: {
      oneOf: [
        {$ref: '#/definitions/money', title: 'As money'},
        {$ref: '#/definitions/id', description: 'As an id'},
      ],
    },
    // type-relevant siblings: a merged copy, as before
    restated: {$ref: '#/definitions/id', type: 'string', description: 'Same type, restated'},
    atMostTwo: {$ref: '#/definitions/tags', maxItems: 2},
  },
}
