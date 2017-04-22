export const input = {
  "title": "RootAnyOf",
  "anyOf": [
    {"$ref": "#/definitions/foo"},
    {"$ref": "#/definitions/bar"},
    {"$ref": "#/definitions/baz"}
  ],
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
  }
}

export const output = `export type RootAnyOf = (Foo | Bar | Baz);

export interface Foo {
  a: string;
  b?: number;
}
export interface Bar {
  a?: ("a" | "b" | "c");
  [k: string]: any;
}
export interface Baz {
  baz?: Bar;
  [k: string]: any;
}
`
