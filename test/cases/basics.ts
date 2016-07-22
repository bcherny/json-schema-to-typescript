export var schema = 
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
    "height": {
      "type": "number"
    },
    "favoriteFoods": {
      "type": "array"
    },
    "likesDogs": {
      "type": "boolean"
    }
  },
  "required": ["firstName", "lastName"]
};

export var configurations = [
  {
    settings: {
      useInterfaceDeclaration: true,
    },
    types:  `interface ExampleSchema {
  firstName: string;
  lastName: string;
  age?: number; // Age in years
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
}`
  },
  {
    settings: {
      propertyDescription: false
    },
    types:  `type ExampleSchema = {
  firstName: string;
  lastName: string;
  age?: number;
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
};`
  }
]