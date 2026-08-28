import {JSONSchema4, JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {isPlainObject} from 'lodash'
import {memoize} from '../memoize'

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

export const DefinitionKey = Symbol('DefinitionKey')

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
  /**
   * draft 7+ annotation (also OpenAPI): the value is managed by the owning authority
   * @see https://json-schema.org/draft-07/json-schema-validation#rfc.section.10.3
   */
  readOnly?: boolean
  /**
   * Set during dereferencing on each entry of a separate file's `definitions`/`$defs`:
   * the key it is held under in that file. Once merged into the referencing document
   * those maps no longer sit at the root (or are not part of the document at all, for a
   * `file.json#/definitions/X` pointer), so this is how the entry keeps its name.
   */
  [DefinitionKey]?: string
}

export const Parent = Symbol('Parent')
export const Shared = Symbol('Shared')
/**
 * Where a schema node was read from: the file (as the resolver addressed it) and the
 * JSON Pointer inside that file. Only stamped when compiling a set of files together
 * (the `imports` mode); absent otherwise.
 */
export const Source = Symbol('Source')
export interface SchemaSource {
  file: string
  pointer: string
}

export interface LinkedJSONSchema extends JSONSchema {
  /**
   * A reference to this schema's parent node, for convenience.
   * `null` when this is the root schema.
   */
  [Parent]: LinkedJSONSchema | null
  /**
   * Set on a schema that is reachable from more than one parent node (the
   * target of a `$ref`, usually), whose `Parent` is just the first one found.
   */
  [Shared]?: true
  [Source]?: SchemaSource

  additionalItems?: boolean | LinkedJSONSchema
  additionalProperties?: boolean | LinkedJSONSchema
  /**
   * @see https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.9.3.2.4
   */
  unevaluatedProperties?: boolean | LinkedJSONSchema
  items?: LinkedJSONSchema | LinkedJSONSchema[]
  /**
   * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.1
   */
  prefixItems?: LinkedJSONSchema[]
  definitions?: {
    [k: string]: LinkedJSONSchema
  }
  properties?: {
    [k: string]: LinkedJSONSchema
  }
  patternProperties?: {
    [k: string]: LinkedJSONSchema
  }
  dependencies?: {
    [k: string]: LinkedJSONSchema | string[]
  }
  allOf?: LinkedJSONSchema[]
  anyOf?: LinkedJSONSchema[]
  oneOf?: LinkedJSONSchema[]
  not?: LinkedJSONSchema
}

export const Types = Symbol('Types')
export const Intersection = Symbol('Intersection')

/**
 * Normalized JSON schema.
 *
 * Note: `definitions`, `id` and `prefixItems` are removed by the normalizer. Use `$defs`, `$id`
 * and `items`/`additionalItems` instead.
 */
export interface NormalizedJSONSchema extends Omit<LinkedJSONSchema, 'definitions' | 'id' | 'prefixItems'> {
  [Intersection]?: NormalizedJSONSchema
  [Parent]: NormalizedJSONSchema | null
  [Types]: ReadonlySet<SchemaType>

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
  /**
   * `false` is normalized to `[]`; `true` is the draft 3 property-level form (see `isRequired` in the parser)
   */
  required: string[] | true
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

export function isBoolean(schema: LinkedJSONSchema | JSONSchemaType): schema is boolean {
  return schema === true || schema === false
}

export function isPrimitive(schema: LinkedJSONSchema | JSONSchemaType): schema is JSONSchemaType {
  return !isPlainObject(schema)
}

export function isCompound(schema: JSONSchema): boolean {
  return Array.isArray(schema.type) || 'anyOf' in schema || 'oneOf' in schema
}
