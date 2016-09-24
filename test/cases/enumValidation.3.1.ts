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

//Third Validation in private validateEnumMembers(): in index.ts
//rule type doesn't match the enum members: string case
export var error = {
  message: 'Enum was declared as "string" type, but found at least one non-string member',
  type: TypeError
}
