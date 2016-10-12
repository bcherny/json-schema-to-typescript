export var schema = {
    "$schema": "http://json-schema.org/draft-03/schema",
    "id": "http://mycompany.com/api/referencing.json",
    "title": "Referencing",
    "type": "object",
    "properties": {
        "ref": {
            "$ref": "../../test/resources/ReferencedTypeWithId.json"
        }
    },
    "required": ["ref"]
}

/**
 * Verify that both generated types names are derived from the schema.title
 */
export var configurations = [
  {
    settings: {
      declareReferenced: true
    },
    types: `export interface ReferencedTypedWithId {
  firstName: string;
  [k: string]: any;
}
export interface Referencing {
  ref: ReferencedTypedWithId;
  [k: string]: any;
}`
  },
  {
    settings: {
      declareReferenced: false
    },
    types: `export interface Referencing {
  ref: ReferencedTypedWithId;
  [k: string]: any;
}`
  }
]

