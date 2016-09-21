export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "type": "integer",
      "enum": [1, 2, 3],
      "tsEnumNames": ["One","Three"]
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

//Fifth Validation in private validateEnumMembers(): in index.ts
export var error = {
  message: 'Property enum and property tsEnumNames must be the same length',
  type: TypeError
}
