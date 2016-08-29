export var schema = 
{
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
    types: `type Enum = {
  foo: "a" | "b" | "c";
  bar: number;
  baz: {
    a: number;
  };
};`
  }, 
  {
    settings: {
      useTypescriptEnums: true,

    },
    types: ``
  }
]

export var types = `type Enum = {
  foo: "a" | "b" | "c";
  bar: number;
  baz: {
    a: number;
  };
};`