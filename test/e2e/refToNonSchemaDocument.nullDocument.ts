/**
 * refToNonSchemaDocument.emptyFile.ts, for a file whose whole content is `null` -- here behind
 * a `$ref` with a sibling keyword, in an `allOf`.
 */
export const input = {
  title: 'RefToNullDocument',
  type: 'object',
  allOf: [{$ref: 'test/resources/NotASchema/null.json', description: 'The shared part'}],
}

export const error =
  /\$ref "test\/resources\/NotASchema\/null\.json" at allOf\/0 resolves to .*NotASchema[\\/]null\.json, which is not a JSON Schema: it parses to null/
