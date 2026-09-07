/**
 * refInPlaceOfSchemaList.notAList.ts, for a stand-in `$ref` with a keyword beside it: the list
 * it leads to cannot carry a `description`, and the message says which `$ref` and which keyword.
 */
export const input = {
  title: 'RefInPlaceOfSchemaListWithSiblingKeyword',
  type: 'object',
  definitions: {
    base: {allOf: [{type: 'object', properties: {id: {type: 'string'}}}]},
  },
  properties: {
    record: {type: 'object', allOf: {$ref: '#/definitions/base/allOf', description: 'The shared part'}},
  },
  additionalProperties: false,
}

export const error =
  'allOf at properties/record must be a list of schemas: $ref "#/definitions/base/allOf" leads to one, but the keywords beside it (description) make an object of it (a $ref standing in for a whole list stands alone).'
