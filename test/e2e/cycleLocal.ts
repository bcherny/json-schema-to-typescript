export let only = true

export const input = {
  "title": "Local Cycle",
  "properties": {
    "foo": {
      "$ref": "#"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export const output = `export interface LocalCycle {
  foo: LocalCycle;
}
`
