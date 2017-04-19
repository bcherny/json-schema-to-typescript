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
      },
      "required": ["knowsFrom"]
    },
    "coworker": {
      "properties": {
        "company": {
          "properties": {
            "name": {
              "type": "string"
            }
          },
          "required": ["name"],
          "additionalProperties": false
        }
      },
      "additionalProperties": {
        "enum": [10, 20, 30],
        "tsEnumNames": ["red", "green", "blue"]
      }
    }
  },
  "required": ["firstName"]
}

export const output = `export interface SchemaWithSubschema {
  firstName: string;
  friend?: {
    knowsFrom: ("work" | "school" | "other");
    [k: string]: any;
  };
  coworker?: {
    company?: {
      name: string;
    };
    [k: string]: KString;
  };
  [k: string]: any;
}

export const enum KString {
  red = 10,
  green = 20,
  blue = 30
}

`
