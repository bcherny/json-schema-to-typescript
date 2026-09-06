/**
 * `$id` names a type; it never changes where a `$ref` resolves. The file `$ref` below is read from disk,
 * relative to this schema, not fetched from example.com (which the root `$id` would make its base URI,
 * read as JSON Schema says), and the `#/definitions/...` pointer under the nested `$id` still points at
 * this document's root (not at `Named`, which has no definitions). Both held on json-schema-ref-parser 11;
 * 16 reads `$id` as the spec does, unless the `$id`s are kept from it.
 */
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://example.com/schemas/idIsAName.json',
  title: 'IdIsAName',
  type: 'object',
  definitions: {
    shared: {type: 'string', enum: ['a', 'b']},
  },
  properties: {
    fromFile: {$ref: 'test/resources/ReferencedType.json'},
    named: {
      $id: 'Named',
      type: 'object',
      properties: {shared: {$ref: '#/definitions/shared'}},
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}
