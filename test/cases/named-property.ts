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

export var types = `/** Array of authorized user ids. */
export type UserIdArray = string[];
/** My cool schema */
export interface ExampleSchema {
  users?: UserIdArray;
  [k: string]: any;
}`

