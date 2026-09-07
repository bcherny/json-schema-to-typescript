/**
 * refToNonSchemaDocument.emptyFile.ts, for a file whose whole content is the JSON array
 * `[1, 2]`: an error naming the `$ref` and the file, not a property of type `[1, 2]`.
 */
export const input = {
  title: 'RefToArrayDocument',
  type: 'object',
  properties: {
    y: {$ref: 'test/resources/NotASchema/array.json'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "test\/resources\/NotASchema\/array\.json" at properties\/y resolves to .*NotASchema[\\/]array\.json, which is not a JSON Schema: it parses to an array of 2 items/
