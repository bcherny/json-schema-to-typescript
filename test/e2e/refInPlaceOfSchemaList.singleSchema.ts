/**
 * refInPlaceOfSchemaList.notAList.ts, for a `$ref` that leads to one schema (a file holding an
 * object) where `allOf` wants a list of them.
 */
export const input = {
  title: 'RefInPlaceOfSchemaListSingleSchema',
  type: 'object',
  properties: {
    person: {type: 'object', allOf: {$ref: 'Person.json'}},
  },
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}

export const error =
  'allOf at properties/person must be a list of schemas: $ref "Person.json" leads to an object (one schema, not a list of them).'
