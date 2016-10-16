export const input = {
  "title": "Schema with Subschema",
  "friend": {
    "properties": {
      "knowsFrom": {
        "enum": ["work", "school", "other"]
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
    knowsFrom: "work" | "school" | "other";
    [k: string]: any;
  }
  firstName: string;
  [k: string]: any;
}
`
