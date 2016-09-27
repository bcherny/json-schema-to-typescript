/* tslint:disable:quotemark object-literal-key-quotes */
export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "bar": {
      "type": "integer",
      "enum": [1, 2, 3],
      "tsEnumNames": ["One", 2, "Three"]
    }
  },
  "required": ["bar"],
  "additionalProperties": false
}
/* tslint:enable:quotemark object-literal-key-quotes */

export var settings = {
  useTypescriptEnums: true
}

export var error = {
  type: TypeError
}
