import {JSONSchema4Type} from 'json-schema'

export type AST_TYPE = AST['type']

export type AST =
  | TAny
  | TArray
  | TBoolean
  | TEnum
  | TInterface
  | TNamedInterface
  | TIntersection
  | TLiteral
  | TNumber
  | TNull
  | TObject
  | TPointer
  | TReference
  | TString
  | TTuple
  | TUnion
  | TUnknown
  | TCustomType

export interface AbstractAST {
  comment?: string
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

export function assertHasStandaloneName(ast: AST): asserts ast is ASTWithStandaloneName {
  if (!hasStandaloneName(ast)) {
    throw TypeError('Expected AST to have a standaloneName, but none was found. This is a bug -- please report it.')
  }
}

export function traverse(ast: AST, f: (ast: AST) => void, processed = new WeakSet<AST>()): void {
  // Handle cycles
  if (processed.has(ast)) {
    return
  }
  processed.add(ast)

  // Process
  f(ast)

  // Traverse
  switch (ast.type) {
    case 'ARRAY':
      return traverse(ast.params, f, processed)
    case 'ENUM':
      return ast.params.forEach(_ => traverse(_.ast, f, processed))
    case 'INTERSECTION':
    case 'UNION':
      return ast.params.forEach(_ => traverse(_, f, processed))
    case 'INTERFACE':
      ast.params.forEach(_ => traverse(_.ast, f, processed))
      ast.superTypes.forEach(_ => traverse(_, f, processed))
      return
    case 'TUPLE':
      ast.params.forEach(_ => traverse(_, f, processed))
      if (ast.spreadParam) {
        traverse(ast.spreadParam, f, processed)
      }
      return
  }
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

export interface TInterfaceParam {
  ast: AST
  keyName: string
  isRequired: boolean
  isPatternProperty: boolean
  isUnreachableDefinition: boolean
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

export interface TPointer extends AbstractAST {
  type: 'POINTER'
  params: string
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
  type: 'ANY'
}

export const T_ANY_ADDITIONAL_PROPERTIES: TAny & ASTWithName = {
  keyName: '[k: string]',
  type: 'ANY'
}

export const T_UNKNOWN: TUnknown = {
  type: 'UNKNOWN'
}

export const T_UNKNOWN_ADDITIONAL_PROPERTIES: TUnknown & ASTWithName = {
  keyName: '[k: string]',
  type: 'UNKNOWN'
}
