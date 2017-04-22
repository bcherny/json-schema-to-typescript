export const input = {
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

// TODO: dont generate  extraneous parens around union types
export const output = `/**
 * My cool schema
 */
export interface ExampleSchema {
  value: (number | string);
  anotherValue?: (null | string);
  [k: string]: any;
}
`
