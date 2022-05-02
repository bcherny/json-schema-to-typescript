import {JSONSchema4Type} from 'json-schema'

export type AST_TYPE = AST['type']

export type AST =
  | TAny
  | TArray
  | TBoolean
  | TEnum
  | TInterface
  | TInterfaceParam
  | TNamedInterface
  | TIntersection
  | TLiteral
  | TNumber
  | TNull
  | TObject
  | TReference
  | TString
  | TTuple
  | TUnion
  | TUnknown
  | TCustomType

export type ASTWithoutHashcode = Omit<AST, 'hashCode'>

export interface AbstractAST {
  comment?: string
  // Performance optimization, for quick de-duplication by value
  hashCode: string
  keyName?: string
  standaloneName?: string
  type: AST_TYPE
}

export type ASTWithComment = AST & {comment: string}
export type ASTWithName = AST & {keyName: string}
export type ASTWithStandaloneName = AST & {standaloneName: string}

export function hasComment(ast: AST): ast is ASTWithComment {
  return 'comment' in ast && ast.comment != null && ast.comment !== ''
}

export function hasStandaloneName(ast: AST): ast is ASTWithStandaloneName {
  return 'standaloneName' in ast && ast.standaloneName != null && ast.standaloneName !== ''
}

////////////////////////////////////////////     types

export interface TAny extends AbstractAST {
  type: 'ANY'
}

export interface TArray extends AbstractAST {
  type: 'ARRAY'
  params: AST
}

export interface TBoolean extends AbstractAST {
  type: 'BOOLEAN'
}

export interface TEnum extends AbstractAST {
  standaloneName: string
  type: 'ENUM'
  params: TEnumParam[]
}

export interface TEnumParam {
  ast: AST
  keyName: string
}

export interface TInterface extends AbstractAST {
  type: 'INTERFACE'
  params: TInterfaceParam[]
  superTypes: TNamedInterface[]
}

export interface TNamedInterface extends AbstractAST {
  standaloneName: string
  type: 'INTERFACE'
  params: TInterfaceParam[]
  superTypes: TNamedInterface[]
}

export interface TInterfaceParam extends AbstractAST {
  ast: AST
  comment: undefined
  keyName: string
  isRequired: boolean
  isPatternProperty: boolean
  isUnreachableDefinition: boolean
  standaloneName: undefined
  type: 'INTERFACE_PARAM'
}

export interface TIntersection extends AbstractAST {
  type: 'INTERSECTION'
  params: AST[]
}

export interface TLiteral extends AbstractAST {
  params: JSONSchema4Type
  type: 'LITERAL'
}

export interface TNumber extends AbstractAST {
  type: 'NUMBER'
}

export interface TNull extends AbstractAST {
  type: 'NULL'
}

export interface TObject extends AbstractAST {
  type: 'OBJECT'
}

export interface TReference extends AbstractAST {
  type: 'REFERENCE'
  params: string
}

export interface TString extends AbstractAST {
  type: 'STRING'
}

export interface TTuple extends AbstractAST {
  type: 'TUPLE'
  params: AST[]
  spreadParam?: AST
  minItems: number
  maxItems?: number
}

export interface TUnion extends AbstractAST {
  type: 'UNION'
  params: AST[]
}

export interface TUnknown extends AbstractAST {
  type: 'UNKNOWN'
}

export interface TCustomType extends AbstractAST {
  type: 'CUSTOM_TYPE'
  params: string
}

////////////////////////////////////////////     literals

export const T_ANY: TAny = {
  hashCode: 'ANY',
  type: 'ANY'
}

export const T_ANY_ADDITIONAL_PROPERTIES: TAny & ASTWithName = {
  hashCode: 'ANY_ADDITIONAL_PROPERTIES',
  keyName: '[k: string]',
  type: 'ANY'
}

export const T_UNKNOWN: TUnknown = {
  hashCode: 'UNKNOWN',
  type: 'UNKNOWN'
}

export const T_UNKNOWN_ADDITIONAL_PROPERTIES: TUnknown & ASTWithName = {
  hashCode: 'UNKNOWN_ADDITIONAL_PROPERTIES',
  keyName: '[k: string]',
  type: 'UNKNOWN'
}
