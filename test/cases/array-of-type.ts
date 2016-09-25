export var schema = {
  "title": "Array of type",
  "type": "object",
  "properties": {
    "foo": {
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "bar": {
      "items": {
        "type": "string"
      },
      "type": ["array"]
    },
    "baz": {
      "items": {
        "type": ["string", "number"]
      },
      "type": ["array"]
    }
  }
}

export var types =  `export interface ArrayOfType {
  foo?: string[];
  bar?: string[];
  baz?: (string | number)[];
  [k: string]: any;
}`
