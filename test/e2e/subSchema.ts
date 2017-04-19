export const input = {
  "title": "Schema with Subschema",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "friend": {
      "properties": {
        "knowsFrom": {
          "enum": ["work", "school", "other"]
        }
      }
    }
  },
  "required": ["firstName"]
}

export const output = `export interface SchemaWithSubschema {
  firstName: string;
  friend: {
    knowsFrom: "work" | "school" | "other";
    [k: string]: any;
  }
  [k: string]: any;
}
`
