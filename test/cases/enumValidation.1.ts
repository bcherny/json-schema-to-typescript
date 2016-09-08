export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "type": "string",
      "enum": ["foo", 2, 3],
      "tsEnumNames": ["One","Two","Three"]
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

export var error = {
  type: TypeError,
  message: 'Enum was declared as a string type but found at least one non-string member'
}
