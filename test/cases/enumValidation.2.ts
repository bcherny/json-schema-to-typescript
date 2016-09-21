export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "type": "Number",
      "enum": [1.1, 2.2, 3.3]
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

//Second Validation in private validateEnumMembers(): in index.ts
//a type was specified that compiler does not handle
export var error = {
  message: 'Enum type must be string, boolean or integer. It was declared as Number',
  type: TypeError
}
