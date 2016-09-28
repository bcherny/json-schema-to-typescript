/* tslint:disable:quotemark object-literal-key-quotes */
export var schema = {
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "required": ["foo"],
  "additionalProperties": false
}
/* tslint:enable:quotemark object-literal-key-quotes */

export var types = `export interface UnnamedSchema {
  foo: string;
}`
