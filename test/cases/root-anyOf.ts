export var schema = {
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

export var types = `type Foo = {
  a: string;
  b?: number;
};
type Bar = {
  a?: "a" | "b" | "c";
  [k: string]: any;
};
type Baz = {
  baz?: Bar;
  [k: string]: any;
};
type RootAnyOf = Foo | Bar | Baz;`
