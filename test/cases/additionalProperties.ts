/* tslint:disable:quotemark object-literal-key-quotes */
export var schema = {
  "title": "AdditionalProperties",
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "additionalProperties": {
    "type": "number"
  }
}
/* tslint:enable:quotemark object-literal-key-quotes */

export var types = `export interface AdditionalProperties {
  foo?: string;
  [k: string]: number;
}`
