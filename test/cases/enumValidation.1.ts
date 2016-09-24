export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "enum": [1, 2, 'a'],
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}

export var settings = {
  useTypescriptEnums: true
}

//First Validation in index.ts
//rule.type is undefined or it was not inferable
export var error = {
  message: 'Enum type must be string, boolean or integer. It was not declared or could not be inferred by enum values',
  type: TypeError
}
