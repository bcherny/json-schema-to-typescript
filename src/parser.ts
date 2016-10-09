import { JSONSchema } from './JSONSchema'
import { SCHEMA_TYPE, typeOfSchema } from './typeOfSchema'

export type AST_TYPE  = 'ANY' | 'ARRAY' | 'BOOLEAN' | 'ENUM' | 'INTERFACE' | 'INTERSECTION' | 'NUMBER' | 'NULL' | 'OBJECT' | 'REFERENCE' | 'STRING' | 'TUPLE' | 'UNION'

export interface AST {
  comment?: string
  keyName: string
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
}

export interface TReference extends AST {
  type: 'REFERENCE'
  params: string
}

export interface TAny extends AST {
  type: 'ANY'
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

const TAny: TAny = {
  isRequired: false,
  keyName: '',
  type: 'ANY'
}

////////////////////////////////////////////     parser

export function parse(schema: JSONSchema, keyName: string): AST {
  switch (typeOfSchema(schema)) {
    case 'ALL_OF':
      // TODO: support schema.properties
      return { keyName, isRequired: false, params: schema.allOf!.map(parse), type: 'INTERSECTION' }
    case 'ANY':
      return { keyName, isRequired: false, type: 'ANY' }
    case 'ANY_OF':
      return { keyName, isRequired: false, params: schema.anyOf!.map(parse), type: 'UNION' }
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        return { keyName, isRequired: false, params: schema.items.map(parse), type: 'TUPLE' }
      } else {
        return { keyName, isRequired: false, params: parse(schema.items!), type: 'ARRAY' } as TArray
      }
    case 'UNTYPED_ARRAY':
      return { keyName, isRequired: false, params: TAny, type: 'ARRAY' }
    case 'UNNAMED_ENUM':
      return { keyName, isRequired: false, params: schema.enum!.map(parse), type: 'UNION' }
    case 'NAMED_ENUM':
      return {
        keyName, isRequired: false, params: schema.enum!.map(parse).map((_, n) => [schema.tsEnumNames, _]), type: 'ENUM'
      }
    case 'BOOLEAN':
      return { keyName, isRequired: false, type: 'BOOLEAN' }
    case 'NUMBER':
      return { keyName, isRequired: false, type: 'NUMBER' }
    case 'NULL':
      return { keyName, isRequired: false, type: 'NULL' }
    case 'OBJECT':
      return { keyName, isRequired: false, type: 'OBJECT' }
    case 'STRING':
      return { keyName, isRequired: false, type: 'STRING' }
    case 'UNION':
      return { keyName, isRequired: false, params: schema.type!.map(parse), type: 'UNION' }
  }
}


