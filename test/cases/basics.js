exports.in = `
{
  "title": "Example Schema",
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
    },
    "favoriteFoods": {
      "type": "array"
    },
    "likesDogs": {
      "type": "boolean"
    }
  },
  "required": ["firstName", "lastName"]
}
`

exports.out = `
interface ExampleSchema {
  firstName: string;
  lastName: string;
  age?: number; // Age in years
  favoriteFoods?: array;
  likesDogs?: boolean;
  [a: string]: any;
}`