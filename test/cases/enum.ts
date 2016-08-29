export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "enum": ["a", "b", "c"]
    },
    "bar": {
      "enum": [1, 2, 3],
      "tsEnumNames": ["One","Two","Three"]
    },
    "baz": {
      "enum": [
        { "a": 1 },
        { "a": 2 },
        { "a": 3 }
      ]
    }
  },
  "required": ["foo", "bar", "baz"],
  "additionalProperties": false
}

export var configurations = [
  {
    settings: {
      useTypescriptEnums: false
    },
    types: `interface Enum {
  foo: "a" | "b" | "c";
  bar: number;
  baz: {
    a: number;
  };
}`
  }, 
  {
    settings: {
      useTypescriptEnums: true
    },
    types: `enum Foo {
  a,
  b,
  c
}
enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
enum Baz {
  [object Object],
  [object Object],
  [object Object]
}
interface Enum {
  foo: Foo;
  bar: Bar;
  baz: Baz;
}`
  }
]
