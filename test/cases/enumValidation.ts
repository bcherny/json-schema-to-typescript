export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "type": "integer",
      "enum": ["a", "b", "c"]
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

export var error = {
  type: TypeError,
  message: 'Enum was declared as an integer type, but found at least one non-integer member'
}
