export var schema = 
{
  "title": "Referencing",
  "type": "object",
  "properties": {
    "foo": {
      "$ref": "test/resources/ReferencedType.json"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export var configurations = [
  {
    settings: {
      declareReferenced: true
    },
    types: `interface ExampleSchema {
  firstName: string;
  lastName: string;
  age?: number; // Age in years
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
}
interface Referencing {
  foo: ExampleSchema;
}`
  }, 
  {
    settings: {
      declareReferenced: false
    },
    types: `interface Referencing {
  foo: ExampleSchema;
}`
  }
]