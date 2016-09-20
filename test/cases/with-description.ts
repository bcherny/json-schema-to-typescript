export var schema = {
  "title": "Example Schema",
  "description": "My cool schema",
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
  "required": ["firstName", "lastName"]
}

export var types = `/** My cool schema */
export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /** Age in years */
  age?: number;
  [k: string]: any;
}`
