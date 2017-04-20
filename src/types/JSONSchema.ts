import { JSONSchema4 } from 'json-schema'

export type SCHEMA_TYPE = 'ALL_OF' | 'UNNAMED_SCHEMA' | 'ANY' | 'ANY_OF'
  | 'BOOLEAN' | 'NAMED_ENUM' | 'NAMED_SCHEMA' | 'NULL' | 'NUMBER' | 'STRING'
  | 'OBJECT' | 'TYPED_ARRAY' | 'REFERENCE' | 'UNION' | 'UNNAMED_ENUM'
  | 'UNTYPED_ARRAY'

export interface JSONSchema extends JSONSchema4 {
  /**
   * schema extension to support numeric enums
   */
  tsEnumNames?: string[]
}

// const SCHEMA_PROPERTIES = [
//   'additionalItems', 'additionalProperties', 'items', 'definitions',
//   'properties', 'patternProperties', 'dependencies', 'allOf', 'anyOf',
//   'oneOf', 'not', 'required', '$schema', 'title', 'description',
// ]

// export function isSchema(a: any): a is SchemaSchema {
//   return []
// }

export interface NormalizedJSONSchema extends JSONSchema {
  additionalItems?: boolean | NormalizedJSONSchema
  additionalProperties: boolean | NormalizedJSONSchema
  items?: NormalizedJSONSchema | NormalizedJSONSchema[]
  definitions?: {
    [k: string]: NormalizedJSONSchema
  }
  properties?: {
    [k: string]: NormalizedJSONSchema
  }
  patternProperties?: {
    [k: string]: NormalizedJSONSchema
  }
  dependencies?: {
    [k: string]: NormalizedJSONSchema | string[]
  }
  allOf?: NormalizedJSONSchema[]
  anyOf?: NormalizedJSONSchema[]
  oneOf?: NormalizedJSONSchema[]
  not?: NormalizedJSONSchema
  required: string[]
}

export interface EnumJSONSchema extends NormalizedJSONSchema {
  enum: any[]
}

export interface NamedEnumJSONSchema extends NormalizedJSONSchema {
  tsEnumNames: string[]
}

export interface SchemaSchema extends NormalizedJSONSchema {
  properties: {
    [k: string]: NormalizedJSONSchema
  }
  required: string[]
}

export interface JSONSchemaWithDefinitions extends NormalizedJSONSchema {
  definitions: {
    [k: string]: NormalizedJSONSchema
  }
}
