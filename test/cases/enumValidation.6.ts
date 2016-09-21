export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "type": "integer",
      "enum": [1, 2, 3],
      "tsEnumNames": ["One",2,"Three"]
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

//Sixth Validation in private validateEnumMembers(): in index.ts
export var error = {
  message: 'Enum was declared as "integer" type, but found at least one non-string tsEnumValue',
  type: TypeError
}
