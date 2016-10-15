export const input = {
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export const output = `export interface UnnamedSchema {
  foo: string;
}
`
