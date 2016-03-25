exports.in = `
{
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "enum": ["a", "b", "c"]
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}
`

exports.out = `interface Enum {
  foo: "a" | "b" | "c";
}`