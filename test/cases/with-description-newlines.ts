export var schema = {
  "title": "Example Schema",
  "description": "My cool schema",
  "type": "object",
  "properties": {
    "firstName": {
      "description": "first name single line description",
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age description with\nmultiple lines",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["firstName", "lastName"]
}

export var types = `/**
 * My cool schema
 */
export interface ExampleSchema {
  /**
   * first name single line description
   */
  firstName: string;
  lastName: string;
  /**
   * Age description with
   * multiple lines
   */
  age?: number;
  [k: string]: any;
}`
