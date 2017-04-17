export const input = {
  "title": "Local Cycle (2)",
  "properties": {
    "foo": {
      "$ref": "#"
    },
    "bar": {
      "$ref": "#"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export const output = `export interface LocalCycle {
  foo: LocalCycle;
  bar: LocalCycle;
}
`
