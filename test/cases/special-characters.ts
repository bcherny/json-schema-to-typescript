export var schema = {
  "title": "Example Schema",
  "type": "object",
  "properties": {
    "`foo`": {
      "type": "string"
    },
    "'bar'": {
      "type": "string"
    },
    "\"baz\"": {
      "type": "string"
    },
    "qux...": {
      "type": "number"
    },
  },
  "required": ["`foo`", "'bar'", "\"baz\""]
}

export var configurations = [
  {
    types: `export interface ExampleSchema {
  "\`foo\`": string;
  "'bar'": string;
  "\\\"baz\\\"": string;
  "qux..."?: number;
  [k: string]: any;
}`
  }
]
