export const input = {
    "$schema": "http://json-schema.org/draft/2019-09/schema#",
    "title": "Example Schema",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string",
        "deprecated": true
      },
    },
    "additionalProperties": false,
    "required": [
      "firstName"
    ]
  }