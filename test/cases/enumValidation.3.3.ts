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

//Third Validation in private validateEnumMembers(): in index.ts
//rule type doesn't match the enum members: integer case
export var error = {
  message: 'Enum was declared as "integer" type, but found at least one non-integer member',
  type: TypeError
}
