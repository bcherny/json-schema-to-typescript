/**
 * refInPlaceOfSchemaList.externalFile.ts, with JSON Pointers into the document itself: each list
 * is borrowed from a definition's own `allOf`/`anyOf`/`oneOf`/`prefixItems`.
 */
export const input = {
  title: 'RefInPlaceOfSchemaListInDocument',
  type: 'object',
  definitions: {
    base: {
      allOf: [
        {type: 'object', properties: {id: {type: 'string'}}, required: ['id'], additionalProperties: false},
        {type: 'object', properties: {createdAt: {type: 'integer'}}, additionalProperties: false},
      ],
    },
    scalar: {anyOf: [{type: 'string'}, {type: 'number'}]},
    kind: {oneOf: [{enum: ['file']}, {enum: ['folder']}]},
    pair: {type: 'array', prefixItems: [{type: 'string'}, {type: 'boolean'}]},
  },
  properties: {
    record: {type: 'object', allOf: {$ref: '#/definitions/base/allOf'}},
    value: {anyOf: {$ref: '#/definitions/scalar/anyOf'}},
    kind: {oneOf: {$ref: '#/definitions/kind/oneOf'}},
    pair: {type: 'array', prefixItems: {$ref: '#/definitions/pair/prefixItems'}},
  },
  required: ['record', 'value', 'kind', 'pair'],
  additionalProperties: false,
}
