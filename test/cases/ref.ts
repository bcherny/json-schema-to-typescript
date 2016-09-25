export var schema =
{
  "title": "Referencing",
  "type": "object",
  "properties": {
    "foo": {
      "$ref": "../../test/resources/ReferencedType.json"
    },
    "bar": {
      "company": "string"
    },
    "baz": {
      "$ref": "#/properties/bar"
    },
    "moo": {
      "$ref": "#/properties/baz"
    }
  },
  "required": ["foo", "bar"],
  "additionalProperties": false
}

export var configurations = [
  {
    settings: {
      declareReferenced: true
    },
    types: `export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /** Age in years */
  age?: number;
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
}
export interface Bar {
  company?: string
}
export interface Referencing {
  foo: ExampleSchema;
  bar: Bar;
  baz: Bar;
  moo: Bar;
}`
  },
  {
    settings: {
      declareReferenced: false
    },
    types: `export interface Referencing {
  foo: ExampleSchema;
}`
  }
]
