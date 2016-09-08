export var schema = {
  "title": "Array of type",
  "type": "object",
  "properties": {
    "foo": {
      "items": {
        "type": "string"
      },
      "type": "array"
    }
  }
}

export var types =  `export interface ArrayOfType {
  foo?: string[];
  [k: string]: any;
}`
