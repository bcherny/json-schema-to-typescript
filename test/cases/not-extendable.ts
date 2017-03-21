export var schema = {
  "title": "Example Schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["firstName", "lastName"],
  "additionalProperties": false
}

export var types = `export interface ExampleSchema {
  "firstName": string;
  "lastName": string;
  /**
   * Age in years
   */
  "age"?: number;
}`
