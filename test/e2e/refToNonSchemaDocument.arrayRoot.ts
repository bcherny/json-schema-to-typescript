/**
 * refToNonSchemaDocument.arrayDocument.ts, with the `$ref` at the root and a `title` beside it:
 * the ref parser merges the array's members into the root as keys `0` and `1`, and the whole
 * schema used to compile to `unknown` without complaint.
 */
export const input = {
  title: 'RefToArrayDocumentRoot',
  $ref: 'test/resources/NotASchema/array.json',
}

export const error =
  /\$ref "test\/resources\/NotASchema\/array\.json" at the root resolves to .*NotASchema[\\/]array\.json, which is not a JSON Schema: it parses to an array of 2 items/
