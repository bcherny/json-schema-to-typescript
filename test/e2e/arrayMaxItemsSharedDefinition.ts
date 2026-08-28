// The nested-bounded-array guard (see arrayNestedMaxItems) multiplies an inline `items` schema by
// the arrays around it, because its tuples are spelled out again inside each of theirs. A named
// `items` type -- here a `$ref`'d array of 1-5 strings -- is printed once, so it is judged on its
// own bounds wherever it is reached from: every `Row*` below is the same five-tuple union (arrays
// of six of them would put an inline one over the default budget of 20), whether `definitions` is
// written before or after `items`, whichever of two arrays holding it comes first, and whether it
// is also used directly as a property.
const row = () => ({type: 'array', minItems: 1, maxItems: 5, items: {type: 'string'}})
export const input = {
  type: 'object',
  properties: {
    definitionsFirst: {
      definitions: {row: row()},
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {$ref: '#/properties/definitionsFirst/definitions/row'},
    },
    itemsFirst: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {$ref: '#/properties/itemsFirst/definitions/rowItemsFirst'},
      definitions: {rowItemsFirst: row()},
    },
    bigFirst: {
      type: 'object',
      properties: {
        big: {type: 'array', minItems: 6, maxItems: 6, items: {$ref: '#/definitions/rowBigFirst'}},
        small: {type: 'array', maxItems: 1, items: {$ref: '#/definitions/rowBigFirst'}},
      },
    },
    smallFirst: {
      type: 'object',
      properties: {
        small: {type: 'array', maxItems: 1, items: {$ref: '#/definitions/rowSmallFirst'}},
        big: {type: 'array', minItems: 6, maxItems: 6, items: {$ref: '#/definitions/rowSmallFirst'}},
      },
    },
    keywordOrderVsDocumentOrder: {
      type: 'object',
      additionalProperties: {type: 'array', minItems: 6, maxItems: 6, items: {$ref: '#/definitions/rowUnderBoth'}},
      properties: {small: {type: 'array', maxItems: 1, items: {$ref: '#/definitions/rowUnderBoth'}}},
    },
    manyFirst: {
      type: 'object',
      properties: {
        many: {type: 'array', minItems: 6, maxItems: 6, items: {$ref: '#/definitions/rowAlsoProperty'}},
        one: {$ref: '#/definitions/rowAlsoProperty'},
      },
    },
  },
  additionalProperties: false,
  definitions: {rowBigFirst: row(), rowSmallFirst: row(), rowUnderBoth: row(), rowAlsoProperty: row()},
}
