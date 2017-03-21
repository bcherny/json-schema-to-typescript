export var schema =
{
  "title": "Referencing",
  "type": "object",
  "properties": {
    "foo": {
      "$ref": "../../test/resources/ReferencedType.json"
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
    types: `export interface ExampleSchema {
  "firstName": string;
  "lastName": string;
  /**
   * Age in years
   */
  "age"?: number;
  "height"?: number;
  "favoriteFoods"?: any[];
  "likesDogs"?: boolean;
  [k: string]: any;
}
export interface Referencing {
  "foo": ExampleSchema;
}`
  },
  {
    settings: {
      declareReferenced: false
    },
    types: `export interface Referencing {
  "foo": ExampleSchema;
}`
  }
]
