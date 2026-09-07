/**
 * refInPlaceOfSchemaList.notAList.ts, for a `null` written in place of the list: the same
 * message, minus a `$ref` to blame.
 */
export const input = {
  title: 'SchemaListWrittenInPlace',
  type: 'object',
  properties: {
    person: {type: 'object', allOf: null},
  },
  additionalProperties: false,
}

export const error = 'allOf at properties/person must be a list of schemas: found null.'
