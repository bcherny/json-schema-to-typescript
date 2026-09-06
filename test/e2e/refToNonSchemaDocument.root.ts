/**
 * refToNonSchemaDocument.emptyFile.ts, with the `$ref` at the root: the whole schema would be
 * the string `"hello"`, which used to compile to an empty file without complaint.
 */
export const input = {
  $ref: 'test/resources/NotASchema/string.json',
}

export const error =
  /\$ref "test\/resources\/NotASchema\/string\.json" at the root resolves to .*NotASchema[\\/]string\.json, which is not a JSON Schema: it parses to the string "hello"/
