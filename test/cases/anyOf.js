exports.in = `
{
  "title": "AnyOf",
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "anyOf": [
        {"$ref": "#/definitions/foo"},
        {"$ref": "#/definitions/bar"},
        {"$ref": "#/definitions/baz"}
      ]
    }
  },
  "definitions": {
    "foo": {
      "properties": {
        "a": { "type": "string" },
        "b": { "type": "integer" }
      },
      "additionalProperties": false,
      "required": ["a"]
    },
    "bar": {
      "properties": {
        "a": { "enum": ["a", "b", "c"] }
      }
    },
    "baz": {
      "properties": {
        "baz": { "$ref": "#/definitions/bar" }
      }
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}
`

exports.out = `interface Foo {
  a: string;
  b?: number;
}
interface Bar {
  a?: "a" | "b" | "c";
  [k: string]: any;
}
interface Baz {
  baz?: Bar;
  [k: string]: any;
}
interface AnyOf {
  foo: Foo | Bar | Baz;
}`