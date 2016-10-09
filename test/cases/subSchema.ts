export const schema = {
  "title": "Schema with Subschema",
  "friend": {
    "properties": {
      "firstName": {
        "type": "string"
      }
    }
  },
  "properties": {
    "firstName": {
      "type": "string"
    }
  },
  "required": ["firstName"]
}

export const types = `export interface SchemaWithSubschema {
  friend: {
    firstName: string;
    [k: string]: any;
  }
  firstName: string;
  [k: string]: any;
}`
