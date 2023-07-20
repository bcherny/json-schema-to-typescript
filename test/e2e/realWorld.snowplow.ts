export const input = {
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#',
  description: 'Schema for an example event',
  self: {
    vendor: 'com.example_company',
    name: 'example_event',
    format: 'jsonschema',
    version: '1-0-0'
  },
  type: 'object',
  properties: {
    exampleStringField: {
      description: 'Example string field',
      type: 'string',
      maxLength: 255
    }
  },
  additionalProperties: false
}
