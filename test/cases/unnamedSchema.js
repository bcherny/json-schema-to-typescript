exports.in = `
{
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}
`

exports.out = `interface Interface1 {
  foo: string;
}`