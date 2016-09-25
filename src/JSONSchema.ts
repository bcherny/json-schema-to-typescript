export type SimpleType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'

export type HttpJsonSchemaOrgDraft04Schema = JSONSchema

export interface JSONSchema {
  id?: string
  $ref?: string
  $schema?: string
  title?: string
  description?: string
  default?: any
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  additionalItems?: boolean | JSONSchema
  items?: JSONSchema | JSONSchema[]
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  required?: string[]
  additionalProperties?: boolean | JSONSchema
  definitions?: {
    [k: string]: JSONSchema
  }
  properties?: {
    [k: string]: JSONSchema
  }
  patternProperties?: {
    [k: string]: JSONSchema
  }
  dependencies?: {
    [k: string]: JSONSchema | string[]
  }
  enum?: any[]

  // schema extension to support numeric enums
  tsEnumNames?: string[]

  type?: SimpleType | SimpleType[]
  allOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  oneOf?: JSONSchema[]
  not?: JSONSchema
  [k: string]: any
}

export interface EnumJSONSchema extends JSONSchema {
  enum: any[]
}

export interface NamedEnumJSONSchema extends EnumJSONSchema {
  tsEnumNames: string[]
}
