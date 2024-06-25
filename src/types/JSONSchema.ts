import {JSONSchema4, JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {isPlainObject, memoize} from 'lodash'

export type SchemaType =
  | 'ALL_OF'
  | 'UNNAMED_SCHEMA'
  | 'ANY'
  | 'ANY_OF'
  | 'BOOLEAN'
  | 'NAMED_ENUM'
  | 'NAMED_SCHEMA'
  | 'NEVER'
  | 'NULL'
  | 'NUMBER'
  | 'STRING'
  | 'OBJECT'
  | 'ONE_OF'
  | 'TYPED_ARRAY'
  | 'REFERENCE'
  | 'UNION'
  | 'UNNAMED_ENUM'
  | 'UNTYPED_ARRAY'
  | 'CUSTOM_TYPE'

export type JSONSchemaTypeName = JSONSchema4TypeName
export type JSONSchemaType = JSONSchema4Type

export interface JSONSchema extends JSONSchema4 {
  /**
   * schema extension to support numeric enums
   */
  tsEnumNames?: string[]
  /**
   * schema extension to support custom types
   */
  tsType?: string
  /**
   * property exists at least in https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9.3
   */
  deprecated?: boolean
}

export const Parent = Symbol('Parent')

export interface AnnotatedJSONSchema extends JSONSchema {
  [Parent]: AnnotatedJSONSchema

  additionalItems?: boolean | AnnotatedJSONSchema
  additionalProperties?: boolean | AnnotatedJSONSchema
  items?: AnnotatedJSONSchema | AnnotatedJSONSchema[]
  definitions?: {
    [k: string]: AnnotatedJSONSchema
  }
  properties?: {
    [k: string]: AnnotatedJSONSchema
  }
  patternProperties?: {
    [k: string]: AnnotatedJSONSchema
  }
  dependencies?: {
    [k: string]: AnnotatedJSONSchema | string[]
  }
  allOf?: AnnotatedJSONSchema[]
  anyOf?: AnnotatedJSONSchema[]
  oneOf?: AnnotatedJSONSchema[]
  not?: AnnotatedJSONSchema
}

/**
 * Normalized JSON schema.
 *
 * Note: `definitions` and `id` are removed by the normalizer. Use `$defs` and `$id` instead.
 */
export interface NormalizedJSONSchema extends Omit<AnnotatedJSONSchema, 'definitions' | 'id'> {
  [Parent]: NormalizedJSONSchema

  additionalItems?: boolean | NormalizedJSONSchema
  additionalProperties: boolean | NormalizedJSONSchema
  extends?: string[]
  items?: NormalizedJSONSchema | NormalizedJSONSchema[]
  $defs?: {
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
  enum: JSONSchema4Type[]
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
  $defs: {
    [k: string]: NormalizedJSONSchema
  }
}

export interface CustomTypeJSONSchema extends NormalizedJSONSchema {
  tsType: string
}

export const getRootSchema = memoize((schema: NormalizedJSONSchema): NormalizedJSONSchema => {
  const parent = schema[Parent]
  if (!parent) {
    return schema
  }
  return getRootSchema(parent)
})

export function isBoolean(schema: AnnotatedJSONSchema | JSONSchemaType): schema is boolean {
  return schema === true || schema === false
}

export function isPrimitive(schema: AnnotatedJSONSchema | JSONSchemaType): schema is JSONSchemaType {
  return !isPlainObject(schema)
}

export function isCompound(schema: JSONSchema): boolean {
  return Array.isArray(schema.type) || 'anyOf' in schema || 'oneOf' in schema
}

export function isAnnotated(schema: JSONSchema): schema is AnnotatedJSONSchema {
  return schema.hasOwnProperty(Parent)
}
