export var schema = {
    "id": "http://json-schema.org/draft-04/schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "Core schema meta-schema",
    "definitions": {
        "schemaArray": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#" }
        },
        "positiveInteger": {
            "type": "integer",
            "minimum": 0
        },
        "positiveIntegerDefault0": {
            "allOf": [ { "$ref": "#/definitions/positiveInteger" }, { "default": 0 } ]
        },
        "simpleTypes": {
            "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        },
        "stringArray": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "uri"
        },
        "$schema": {
            "type": "string",
            "format": "uri"
        },
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "default": {},
        "multipleOf": {
            "type": "number",
            "minimum": 0,
            "exclusiveMinimum": true
        },
        "maximum": {
            "type": "number"
        },
        "exclusiveMaximum": {
            "type": "boolean",
            "default": false
        },
        "minimum": {
            "type": "number"
        },
        "exclusiveMinimum": {
            "type": "boolean",
            "default": false
        },
        "maxLength": { "$ref": "#/definitions/positiveInteger" },
        "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "pattern": {
            "type": "string",
            "format": "regex"
        },
        "additionalItems": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "items": {
            "anyOf": [
                { "$ref": "#" },
                { "$ref": "#/definitions/schemaArray" }
            ],
            "default": {}
        },
        "maxItems": { "$ref": "#/definitions/positiveInteger" },
        "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "uniqueItems": {
            "type": "boolean",
            "default": false
        },
        "maxProperties": { "$ref": "#/definitions/positiveInteger" },
        "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "definitions": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "properties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "patternProperties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "dependencies": {
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    { "$ref": "#" },
                    { "$ref": "#/definitions/stringArray" }
                ]
            }
        },
        "enum": {
            "type": "array",
            "minItems": 1,
            "uniqueItems": true
        },
        "type": {
            "anyOf": [
                { "$ref": "#/definitions/simpleTypes" },
                {
                    "type": "array",
                    "items": { "$ref": "#/definitions/simpleTypes" },
                    "minItems": 1,
                    "uniqueItems": true
                }
            ]
        },
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
    },
    "dependencies": {
        "exclusiveMaximum": [ "maximum" ],
        "exclusiveMinimum": [ "minimum" ]
    },
    "default": {}
};

export var configurations = [
{
    settings: {
        declareSimpleType: true
    },
    types: `export type PositiveInteger = number;
export type PositiveIntegerDefault0 = PositiveInteger;
export type SchemaArray = HttpJsonSchemaOrgDraft04Schema[];
export type StringArray = string[];
export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
/** Core schema meta-schema */
export interface HttpJsonSchemaOrgDraft04Schema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: PositiveInteger;
  minLength?: PositiveIntegerDefault0;
  pattern?: string;
  additionalItems?: boolean | HttpJsonSchemaOrgDraft04Schema;
  items?: HttpJsonSchemaOrgDraft04Schema | SchemaArray;
  maxItems?: PositiveInteger;
  minItems?: PositiveIntegerDefault0;
  uniqueItems?: boolean;
  maxProperties?: PositiveInteger;
  minProperties?: PositiveIntegerDefault0;
  required?: StringArray;
  additionalProperties?: boolean | HttpJsonSchemaOrgDraft04Schema;
  definitions?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema;
  };
  properties?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema;
  };
  patternProperties?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema;
  };
  dependencies?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema | StringArray;
  };
  enum?: any[];
  type?: SimpleTypes | SimpleTypes[];
  allOf?: SchemaArray;
  anyOf?: SchemaArray;
  oneOf?: SchemaArray;
  not?: HttpJsonSchemaOrgDraft04Schema;
  [k: string]: any;
}`
    },
    {
    settings: {
        declareSimpleType: false
    },
    types:`export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
/** Core schema meta-schema */
export interface HttpJsonSchemaOrgDraft04Schema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | HttpJsonSchemaOrgDraft04Schema;
  items?: HttpJsonSchemaOrgDraft04Schema | HttpJsonSchemaOrgDraft04Schema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | HttpJsonSchemaOrgDraft04Schema;
  definitions?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema;
  };
  properties?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema;
  };
  patternProperties?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema;
  };
  dependencies?: {
    [k: string]: HttpJsonSchemaOrgDraft04Schema | string[];
  };
  enum?: any[];
  type?: SimpleTypes | SimpleTypes[];
  allOf?: HttpJsonSchemaOrgDraft04Schema[];
  anyOf?: HttpJsonSchemaOrgDraft04Schema[];
  oneOf?: HttpJsonSchemaOrgDraft04Schema[];
  not?: HttpJsonSchemaOrgDraft04Schema;
  [k: string]: any;
}`
    }
]
