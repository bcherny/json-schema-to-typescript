export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "type": "integer",
      "enum": [1, 2, 3]
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

//Fourth Validation in private validateEnumMembers(): in index.ts
export var error = {
  message: 'Property tsEnumNames is required when enum is declared as an integer type',
  type: TypeError
}
