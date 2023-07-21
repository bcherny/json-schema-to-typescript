export const input = {
    "$schema": "http://json-schema.org/draft/2019-09/schema#",
    "title": "Example Schema",
    "type": "object",
    "deprecated": true,
    "properties": {
      "firstName": {
        "type": "string",
        "deprecated": true
      },
      "lastName":{
        "type": "string",
        "deprecated": false
      },
    },
    "additionalProperties": false,
    "required": [
      "firstName"
    ]
  }