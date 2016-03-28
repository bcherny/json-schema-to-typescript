exports.in = `
{
  "title": "AdditionalProperties",
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "additionalProperties": {
    "type": "number"
  }
}
`

exports.out = `interface AdditionalProperties {
  foo?: string;
  [k: string]: number;
}`