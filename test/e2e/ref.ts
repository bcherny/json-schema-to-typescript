export const input =
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

export const outputs = [
  {
    settings: {
      declareReferenced: true
    },
    output: `export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /**
   * Age in years
   */
  age?: number;
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
}
export interface Referencing {
  foo: ExampleSchema;
}
`
  },
  {
    settings: {
      declareReferenced: false
    },
    output: `export interface Referencing {
  foo: ExampleSchema;
}
`
  }
]
