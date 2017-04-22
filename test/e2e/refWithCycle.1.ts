export const input = {
  "title": "Local Cycle",
  "properties": {
    "foo": {
      "$ref": "#"
    },
    "bar": {
      "$ref": "#"
    }
  },
  "required": ["foo"],
  "additionalProperties": true
}

export const output = `export interface LocalCycle {
  foo: LocalCycle;
  bar?: LocalCycle;
  [k: string]: any;
}
`
