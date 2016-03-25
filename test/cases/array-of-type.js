exports.in = `
{
  "title": "Array of type",
  "type": "object",
  "properties": {
    "foo": {
      "items": {
        "type": "string"
      },
      "type": "array"
    }
  }
}
`

exports.out = `interface ArrayOfType {
  foo?: string[];
  [k: string]: any;
}`