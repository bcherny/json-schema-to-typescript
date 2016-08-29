export var schema = {
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export var types = `interface Interface1 {
  foo: string;
}`
