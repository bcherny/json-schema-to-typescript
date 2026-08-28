// The nested-bounded-array guard (see arrayNestedMaxItems) counts the array a schema is the
// `items` of, also when that schema is a definition and `definitions` is written before `items`:
// 10 arrays of 1-5 strings is over the default `maxItems` budget (20) however the keys are ordered,
// so `Row` falls back to an unbounded array in both spellings.
const row = {type: 'array', minItems: 1, maxItems: 5, items: {type: 'string'}}
export const input = {
  type: 'object',
  properties: {
    definitionsFirst: {
      definitions: {row},
      type: 'array',
      maxItems: 10,
      items: {$ref: '#/properties/definitionsFirst/definitions/row'},
    },
    itemsFirst: {
      type: 'array',
      maxItems: 10,
      items: {$ref: '#/properties/itemsFirst/definitions/row2'},
      definitions: {row2: {...row}},
    },
  },
  additionalProperties: false,
}
