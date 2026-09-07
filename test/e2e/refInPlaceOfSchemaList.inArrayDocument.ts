/**
 * refInPlaceOfSchemaList.externalFile.ts, where the schemas holding the stand-in `$ref`s are
 * themselves members of a file that is a list (reached by pointers into it): such a file gets no
 * rewriting before dereferencing, so what its members hold is only judged after.
 */
export const input = {
  title: 'RefInPlaceOfSchemaListInArrayDocument',
  type: 'object',
  properties: {
    record: {$ref: 'SchemaLists/Members.json#/0'},
    value: {$ref: 'SchemaLists/Members.json#/1'},
  },
  required: ['record', 'value'],
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
