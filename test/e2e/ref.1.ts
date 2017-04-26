export const input = {
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

export const outputs = [
  {
    options: {
      declareReferenced: true
    },
    output: `export interface Referencing {
  foo: ExampleSchema;
}
export interface ExampleSchema {
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
`
  },
  {
    options: {
      declareReferenced: false
    },
    output: `export interface Referencing {
  foo: ExampleSchema;
}
`
  }
]
