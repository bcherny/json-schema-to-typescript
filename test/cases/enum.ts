export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "enum": ["a", "b", "c"]
    },
    "bar": {
      "type": "integer",
      "enum": [1, 2, 3],
      "tsEnumNames": ["One","Two","Three"]
    }
  },
  "required": ["foo", "bar"],
  "additionalProperties": false
}

export var configurations = [
  {
    settings: {
      useConstEnums: false
    },
    types: `export enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export interface Enum {
  foo: "a" | "b" | "c";
  bar: Bar;
}`
  },
  {
    settings: {
      useConstEnums: true
    },
    types: `export const enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export interface Enum {
  foo: "a" | "b" | "c";
  bar: Bar;
}`
  }
]
