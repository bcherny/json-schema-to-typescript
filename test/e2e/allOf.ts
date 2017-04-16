export const input = {
  "title": "AllOf",
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "allOf": [
        {"$ref": "#/definitions/foo"},
        {"$ref": "#/definitions/bar"}
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
      "required": ["a", "b"]
    },
    "bar": {
      "properties": {
        "a": { "type": "string" }
      },
      "additionalProperties": false,
      "required": ["a", "b"]
    }
  },
  "required": ["foo", "bar"],
  "additionalProperties": false
}

export const output = `export interface AllOf {
  foo: (Foo & Bar);
}
export interface Foo {
  a: string;
  b: number;
}

export interface Bar {
  a: string;
}
`
