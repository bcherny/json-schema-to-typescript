export const input = {
  "title": "Cycle (2)",
  "properties": {
    "foo": {
      "$ref": "test/resources/cycle.3.json"
    }
  },
  "required": ["foo"],
  "additionalProperties": true
}

export const output = `export interface Cycle2 {
  foo: Cycle3;
  [k: string]: any;
}
export interface Cycle3 {
  foo?: Cycle4;
}
export interface Cycle4 {
  foo?: number;
  bar?: Cycle3;
  [k: string]: any;
}
`
