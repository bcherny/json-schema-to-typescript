export const schema = {
  "title": "Example Schema",
  "description": "My cool schema",
  "type": "object",
  "properties": {
    "value": {
      "type": ["number", "string"]
    },
    "anotherValue": {
      "type": ["null", "string"]
    }
  },
  "required": ["value"]
}

export const types = `/**
 * My cool schema
 */
export interface ExampleSchema {
  value: number | string;
  anotherValue?: null | string;
  [k: string]: any;
}
`
