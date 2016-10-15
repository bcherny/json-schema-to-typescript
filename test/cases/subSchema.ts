export const input = {
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

export const output = `export interface SchemaWithSubschema {
  friend: {
    firstName: string;
    [k: string]: any;
  }
  firstName: string;
  [k: string]: any;
}
`
