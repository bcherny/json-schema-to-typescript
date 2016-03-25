exports.in = `
{
  "title": "Example Schema",
  "description": "My cool schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["firstName", "lastName"]
}
`

exports.out = `/*
    My cool schema
  */
interface ExampleSchema {
  firstName: string;
  lastName: string;
  age?: number; // Age in years
  [k: string]: any;
}`