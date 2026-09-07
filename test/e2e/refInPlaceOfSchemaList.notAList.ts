/**
 * A `$ref` standing in for a whole `anyOf` list has to lead to a list of schemas. This one leads
 * to an `enum`'s values, so the compiler says which keyword, where, which `$ref` and what was
 * found -- rather than crashing (`TypeError: arr.forEach is not a function`) or printing the
 * values as types.
 */
export const input = {
  title: 'RefInPlaceOfSchemaListNotAList',
  type: 'object',
  definitions: {
    status: {enum: ['on', 'off']},
  },
  properties: {
    status: {anyOf: {$ref: '#/definitions/status/enum'}},
  },
  additionalProperties: false,
}

export const error =
  'anyOf at properties/status must be a list of schemas: $ref "#/definitions/status/enum" leads to a list whose item 0 is the string "on".'
