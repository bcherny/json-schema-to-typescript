import { JSONSchema } from './JSONSchema'
import { JSONSchemaType, typeOfSchema } from './typeOfSchema'

export enum AST_TYPE { ANY, ARRAY, BOOLEAN, ENUM, INTERFACE, INTERSECTION, NUMBER, NULL, OBJECT, REFERENCE, STRING, TUPLE, UNION }

export interface AST {
  comment?: string
  keyName: string
  isRequired: boolean
  type: AST_TYPE
  params: any
}

////////////////////////////////////////////     types

export interface TArray extends AST {
  type: AST_TYPE.ARRAY
  params: AST
}

export interface TTuple extends AST {
  type: AST_TYPE.TUPLE
  params: AST[]
}

export interface TInterface extends AST {
  type: AST_TYPE.INTERFACE
  params: AST[]
}

export interface TReference extends AST {
  type: AST_TYPE.REFERENCE
  params: string
}

export interface TAny extends AST {
  type: AST_TYPE.ANY
  params: undefined
}

export interface TIntersection extends AST {
  type: AST_TYPE.INTERSECTION
  params: AST[]
}

export interface TReference extends AST {
  type: AST_TYPE.REFERENCE
  params: string
}

export interface TUnion extends AST {
  type: AST_TYPE.UNION
  params: AST[]
}

////////////////////////////////////////////     literals

const TAny: TAny = {
  isRequired: false,
  params: undefined,
  type: AST_TYPE.ANY,
}

////////////////////////////////////////////     parser

export function parse(schema: JSONSchema, keyName: string): AST {
  switch (typeOfSchema(schema)) {
    case JSONSchemaType.AllOf:
      // TODO: support schema.properties
      return { keyName, isRequired: false, params: schema.allOf!.map(parse), type: AST_TYPE.INTERSECTION }
    case JSONSchemaType.AnyOf:
      return { keyName, isRequired: false, params: schema.anyOf!.map(parse), type: AST_TYPE.UNION }
    case JSONSchemaType.TypedArray:
      if (Array.isArray(schema.items)) {
        return { keyName, isRequired: false, params: schema.items.map(parse), type: AST_TYPE.TUPLE }
      } else {
        return { keyName, isRequired: false, params: parse(schema.items!), type: AST_TYPE.ARRAY }
      }
    case JSONSchemaType.UntypedArray:
      return { keyName, isRequired: false, params: TAny, type: AST_TYPE.ARRAY }
    case JSONSchemaType.UnnamedEnum:
      return { keyName, isRequired: false, params: schema.enum!.map(parse), type: AST_TYPE.UNION }
    case JSONSchemaType.NamedEnum:
      return {
        keyName, isRequired: false, params: schema.enum!.map(parse).map((_, n) => [schema.tsEnumNames, _]), type: AST_TYPE.ENUM
      }
    case JSONSchemaType.Boolean:
      return { keyName, isRequired: false, params: undefined, type: AST_TYPE.BOOLEAN }
    case JSONSchemaType.Number:
      return { keyName, isRequired: false, params: undefined, type: AST_TYPE.NUMBER }
    case JSONSchemaType.Null:
      return { keyName, isRequired: false, params: undefined, type: AST_TYPE.NULL }
    case JSONSchemaType.Object:
      return { keyName, isRequired: false, params: undefined, type: AST_TYPE.OBJECT }
    case JSONSchemaType.String:
      return { keyName, isRequired: false, params: undefined, type: AST_TYPE.STRING }
    case JSONSchemaType.Union:
      return { keyName, isRequired: false, params: schema.type!.map(parse), type: AST_TYPE.UNION }
    case JSONSchemaType.Any:
      return { keyName, isRequired: false, params: undefined, type: AST_TYPE.ANY }
  }
}


