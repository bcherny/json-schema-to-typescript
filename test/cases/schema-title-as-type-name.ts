export var schema = {
    "$schema": "http://json-schema.org/draft-03/schema",
    "id": "http://mycompany.com/api/referencing.json",
    "title": "Referencing",
    "type": "object",
    "properties": {
        "ref": {
            "$ref": "../../test/resources/ReferencedType.json"
        }
    },
    "required": ["ref"],
    "additionalProperties": false
}

/**
 * Verify that both generated types names are derived from the schema.title
 */
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
  "ref": ExampleSchema;
}`
  },
  {
    settings: {
      declareReferenced: false
    },
    types: `export interface Referencing {
  "ref": ExampleSchema;
}`
  }
]

