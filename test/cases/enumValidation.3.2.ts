export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "type": "boolean",
      "enum": ["a"]
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

//Third Validation in private validateEnumMembers(): in index.ts
//rule type doesn't match the enum members: boolean case
export var error = {
  message: 'Enum was declared as "boolean" type, but found at least one non-boolean member',
  type: TypeError
}
