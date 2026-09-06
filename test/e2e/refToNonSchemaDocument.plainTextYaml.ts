/**
 * refToNonSchemaDocument.emptyFile.ts, for a `.yaml` file that holds a line of prose: YAML reads
 * that as one string, which used to come out as the property's type (`y?: "just some text"`).
 */
export const input = {
  title: 'RefToPlainTextYaml',
  type: 'object',
  properties: {
    y: {$ref: 'test/resources/NotASchema/prose.yaml'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "test\/resources\/NotASchema\/prose\.yaml" at properties\/y resolves to .*NotASchema[\\/]prose\.yaml, which is not a JSON Schema: it parses to the string "just some text"/
