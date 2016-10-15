export const schema = {
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export const types = `export interface UnnamedSchema {
  foo: string;
}
`
