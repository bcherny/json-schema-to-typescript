/**
 * refToNonSchemaDocument.emptyFile.ts, for a file whose whole content is the JSON string
 * `"hello"`: an error naming the `$ref` and the file, not a property of type `"hello"`.
 */
export const input = {
  title: 'RefToStringDocument',
  type: 'object',
  properties: {
    y: {$ref: 'test/resources/NotASchema/string.json'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "test\/resources\/NotASchema\/string\.json" at properties\/y resolves to .*NotASchema[\\/]string\.json, which is not a JSON Schema: it parses to the string "hello"/
