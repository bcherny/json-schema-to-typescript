import { JSONSchema, SchemaSchema, SimpleType, Type } from './JSONSchema'
import { typeOfSchema } from './typeOfSchema'
import { map } from 'lodash'

export type AST_TYPE = 'ANY' | 'ARRAY' | 'BOOLEAN' | 'ENUM' | 'INTERFACE'
  | 'INTERSECTION' | 'LITERAL' | 'NUMBER' | 'NULL' | 'OBJECT' | 'REFERENCE'
  | 'STRING' | 'TUPLE' | 'UNION'

export interface AST {
  comment?: string
  name: string
  isRequired: boolean
  type: AST_TYPE
}

////////////////////////////////////////////     types

export interface TArray extends AST {
  type: 'ARRAY'
  params: AST
}

export interface TTuple extends AST {
  type: 'TUPLE'
  params: AST[]
}

export interface TInterface extends AST {
  type: 'INTERFACE'
  params: AST[]

  /**
   * Which ID should $refs reference?
   * eg. "/Users/boris/project/schema.json#"
   * eg. "/Users/boris/project/schema.json#foo/bar"
   */
  refId: string
}

export interface TReference extends AST {
  type: 'REFERENCE'
  params: string
}

export interface TAny extends AST {
  type: 'ANY'
}

export interface TEnum extends AST {
  type: 'ENUM'
  params: AST[]
}

export interface TLiteral extends AST {
  params: Type
  type: 'LITERAL'
}

export interface TIntersection extends AST {
  type: 'INTERSECTION'
  params: AST[]
}

export interface TReference extends AST {
  type: 'REFERENCE'
  params: string
}

export interface TUnion extends AST {
  type: 'UNION'
  params: AST[]
}

////////////////////////////////////////////     literals

const T_ANY: TAny = {
  isRequired: false,
  type: 'ANY'
}

const T_ANY_ADDITIONAL_PROPERTIES: AST = { isRequired: true, name: '[k: string]', type: 'ANY' }

////////////////////////////////////////////     parser

export function parse(
  schema: JSONSchema,
  name?: string,
  rootSchema: JSONSchema = schema,
  isRequired = false
): AST {
  switch (typeOfSchema(schema)) {
    case 'ALL_OF':
      // TODO: support schema.properties
      return { comment: schema.description, name, isRequired, params: schema.allOf!.map(parse), type: 'INTERSECTION' }
    case 'ANY':
      return { comment: schema.description, name, isRequired, type: 'ANY' }
    case 'ANY_OF':
      return { comment: schema.description, name, isRequired, params: schema.anyOf!.map(parse), type: 'UNION' }
    case 'BOOLEAN':
      return { comment: schema.description, name, isRequired, type: 'BOOLEAN' }
    case 'LITERAL':
      return { isRequired, name, params: schema, type: 'LITERAL' } as TLiteral
    case 'NAMED_ENUM':
      return { comment: schema.description, name, isRequired,
        params: schema.enum!.map((_, n) => parse(_, schema.tsEnumNames![n], rootSchema)),
        type: 'ENUM'
      } as TEnum
    case 'NAMED_SCHEMA':
      return { comment: schema.description, name: computeSchemaName(schema as SchemaSchema, name), isRequired, params: parseSchemaSchema(schema as SchemaSchema, rootSchema), type: 'INTERFACE' } as TInterface
    case 'NULL':
      return { comment: schema.description, name, isRequired, type: 'NULL' }
    case 'NUMBER':
      return { comment: schema.description, name, isRequired, type: 'NUMBER' }
    case 'OBJECT':
      return { comment: schema.description, name, isRequired, type: 'OBJECT' }
    case 'REFERENCE':
      return parse(resolveReference(schema.$ref as string, rootSchema), '', schema)
    case 'STRING':
      return { comment: schema.description, name, isRequired, type: 'STRING' }
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        return { comment: schema.description, name, isRequired, params: schema.items.map(parse), type: 'TUPLE' }
      } else {
        return { comment: schema.description, name, isRequired, params: parse(schema.items!), type: 'ARRAY' } as TArray
      }
    case 'UNION':
      return { comment: schema.description, name, isRequired, params: (schema.type as SimpleType[]).map(_ => parse({ type: _})), type: 'UNION' } as TUnion
    case 'UNNAMED_ENUM':
      return { comment: schema.description, name, isRequired, params: schema.enum!.map(_ => parse(_)), type: 'UNION' }
    case 'UNNAMED_SCHEMA':
      return { comment: schema.description, name: 'Foo', isRequired, params: parseSchemaSchema(schema as SchemaSchema, rootSchema), type: 'INTERFACE' } as TInterface
    case 'UNTYPED_ARRAY':
      return { comment: schema.description, name, isRequired, params: T_ANY, type: 'ARRAY' }
  }
}

/**
 * Compute a schema name using a series of fallbacks
 */
function computeSchemaName(
  schema: SchemaSchema,
  name?: string // name from schema's filename
): string {
  return schema.title || schema.id || name || 'Interface1' // TODO: increment interface number
}

/**
 * Helper to parse schema properties into params on the parent schema's type
 */
function parseSchemaSchema(
  schema: SchemaSchema,
  rootSchema: JSONSchema
): AST[] {
  const asts = map(schema.properties, (value, key) =>
    parse(value, key, rootSchema, schema.required.includes(key))
  )
  // handle additionalProperties
  switch (schema.additionalProperties) {
    case true: return asts.concat(T_ANY_ADDITIONAL_PROPERTIES)
    case false: return asts

    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default: return asts.concat(parse(schema.additionalProperties as JSONSchema, '[k: string]', rootSchema, true))
  }
}

function resolveReference(
  $ref: string,
  rootSchema: JSONSchema
  // definitions: Map<string, TEnum | TInterface>,
  // context: AST[]
): JSONSchema {
  const [schemaId, path] = $ref.split('#')
  const schema = schemaId === rootSchema.id
    ? rootSchema
    : resolveSchema(schemaId)

  console.log('schema', schema)
  return resolvePath(schema, path.split('/').slice(1))
}

function resolvePath(schema: JSONSchema, path: string[]): JSONSchema {
  switch (path.length) {
    case 0: return schema
    default:

      // TODO: move to validator
      if (!(path[0] in schema)) {
        throw new ReferenceError(`Referenced path "${path.join('/')}" does not exist in schema`)
      }

      return resolvePath(schema[path[0]], path.slice(1))
  }
}

// TODO
// TODO: use BigstickCarpet/json-schema-ref-parser
function resolveSchema(schemaId: string): Promise<JSONSchema> {
  if (schemaId.startsWith('http://') || schemaId.startsWith('https://')) {
    throw new ReferenceError(`Error resolving schema "${schemaId}" - HTTP schemas are not yet supported!`)
  }

  if (schemaId) {
    throw new ReferenceError(`Error resolving schema "${schemaId}" - external file schemas are not yet supported!`)
  }
}

function resolveExistingReference(
  $ref: string,
  definitions: Map<string, TEnum | TInterface>
): JSONSchema {
  // definitions.
}
