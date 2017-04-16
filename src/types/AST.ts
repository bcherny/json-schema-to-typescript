import { JSONSchema4Type } from 'json-schema'

export type AST_TYPE = 'ANY' | 'ARRAY' | 'BOOLEAN' | 'ENUM' | 'INTERFACE'
  | 'INTERSECTION' | 'LITERAL' | 'NUMBER' | 'NULL' | 'OBJECT' | 'REFERENCE'
  | 'STRING' | 'TUPLE' | 'UNION'

export type AST = TAny | TArray | TBoolean | TEnum | TInterface
  | TIntersection | TLiteral | TNumber | TNull | TObject | TReference
  | TString | TTuple | TUnion

interface AbstractAST {
  comment?: string
  isRequired: boolean
  name?: string
  standaloneName?: string
  type: AST_TYPE
}

export type ASTWithComment = AST & { comment: string }
export type ASTWithName = AST & { name: string }
export type ASTWithStandaloneName = AST & { standaloneName: string }

export function hasComment(ast: AST): ast is ASTWithComment {
  return 'comment' in ast && ast.comment != null && ast.comment !== ''
}

export function hasName(ast: AST): ast is ASTWithName {
  return 'name' in ast
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
  params: ASTWithName[]
}

export interface TInterface extends AbstractAST {
  standaloneName: string
  type: 'INTERFACE'
  params: ASTWithName[]

  /**
   * Which ID should $refs reference?
   * eg. "/Users/boris/project/schema.json#"
   * eg. "/Users/boris/project/schema.json#foo/bar"
   */
  // refId: string
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
}

export interface TUnion extends AbstractAST {
  type: 'UNION'
  params: AST[]
}

////////////////////////////////////////////     literals

export const T_ANY: TAny = {
  isRequired: false,
  type: 'ANY'
}

export const T_ANY_ADDITIONAL_PROPERTIES: TAny & ASTWithName = {
  isRequired: true,
  name: '[k: string]',
  type: 'ANY'
}
