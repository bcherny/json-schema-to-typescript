import { JSONSchema, SchemaSchema } from './JSONSchema'
import { typeOfSchema } from './typeOfSchema'
import { map } from 'lodash'

export type AST_TYPE  = 'ANY' | 'ARRAY' | 'BOOLEAN' | 'ENUM' | 'INTERFACE' | 'INTERSECTION' | 'NUMBER' | 'NULL' | 'OBJECT' | 'REFERENCE' | 'STRING' | 'TUPLE' | 'UNION'

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
      return { name, isRequired, params: schema.allOf!.map(parse), type: 'INTERSECTION' }
    case 'ANY':
      return { name, isRequired, type: 'ANY' }
    case 'ANY_OF':
      return { name, isRequired, params: schema.anyOf!.map(parse), type: 'UNION' }
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        return { name, isRequired, params: schema.items.map(parse), type: 'TUPLE' }
      } else {
        return { name, isRequired, params: parse(schema.items!), type: 'ARRAY' } as TArray
      }
    case 'UNTYPED_ARRAY':
      return { name, isRequired, params: T_ANY, type: 'ARRAY' }
    case 'UNNAMED_ENUM':
      return { name, isRequired, params: schema.enum!.map(parse), type: 'UNION' }
    case 'NAMED_ENUM':
      return {
        name, isRequired, params: schema.enum!.map(parse).map((_, n) => [schema.tsEnumNames, _]), type: 'ENUM'
      }
    case 'BOOLEAN':
      return { name, isRequired, type: 'BOOLEAN' }
    case 'NUMBER':
      return { name, isRequired, type: 'NUMBER' }
    case 'NULL':
      return { name, isRequired, type: 'NULL' }
    case 'OBJECT':
      return { name, isRequired, type: 'OBJECT' }
    case 'STRING':
      return { name, isRequired, type: 'STRING' }
    case 'UNION':
      return { name, isRequired, params: schema.type!.map(parse), type: 'UNION' } as TUnion
    case 'NAMED_SCHEMA':
      return { name, isRequired, params: parseSchemaSchema(schema as SchemaSchema, rootSchema), type: 'INTERFACE' } as TInterface
    case 'UNNAMED_SCHEMA':
      return { name: 'Foo', isRequired, params: parseSchemaSchema(schema as SchemaSchema, rootSchema), type: 'INTERFACE' } as TInterface
    case 'REFERENCE':
      return parse(resolveReference(schema.$ref as string, rootSchema), '', schema)
  }
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
    case true:
      asts.concat(T_ANY_ADDITIONAL_PROPERTIES)
      break
    case false:
      break
    default:
      asts.concat(parseSchemaSchema(schema.additionalProperties as SchemaSchema, rootSchema))
  }

  return asts
}

function resolveReference(
  $ref: string,
  rootSchema: JSONSchema,
  definitions: Map<string, TEnum | TInterface>,
  context: AST[]
): JSONSchema {
  // if ($ref === '#') {
  //   return
  // }
}

function resolveExistingReference(
  $ref: string,
  definitions: Map<string, TEnum | TInterface>
): JSONSchema {
  // definitions.
}
