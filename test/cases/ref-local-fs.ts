export const schema = {
  "title": "Referencing",
  "type": "object",
  "properties": {
    "foo": {
      "$ref": "../resources/ReferencedType.json"
    },
    "bar": {
      "$ref": "../resources/ReferencedType.json#/properties/age"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}

export const configurations = [
  {
    settings: {
      declareReferenced: true
    },
    types: `export interface ExampleSchema {
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
};
export type Age = number;
export interface Referencing {
  foo: ExampleSchema;
  /**
   * Age in years
   */
  bar?: Age;
};`
  },
  {
    settings: {
      declareReferenced: false
    },
    types: `export interface Referencing {
  foo: ExampleSchema;
  /**
   * Age in years
   */
  bar?: number;
};`
  }
]
