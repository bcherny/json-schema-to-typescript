export var schema = {
  "title": "Example Schema",
  "description": "My cool schema",
  "type": "object",
  "properties": {
    "users": {
      "type": "array",
      "title": "user id array",
      "description": "Array of authorized user ids.",
      "items": {
        "type": "string"
      }
    }
  }
}

// TODO: 2nd block comment should annotate UserIdArray, not users
export var types = `export type UserIdArray = string[];
/**
 * My cool schema
 */
export interface ExampleSchema {
  /**
   * Array of authorized user ids.
   */
  users?: UserIdArray;
  [k: string]: any;
}
`
