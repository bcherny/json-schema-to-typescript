import { whiteBright } from 'cli-color'
import { omit } from 'lodash'
import { DEFAULT_OPTIONS, Options } from './index'
import {
  AST, ASTWithStandaloneName, hasComment, hasStandaloneName, TArray, TEnum, TInterface, TIntersection,
  TNamedInterface, TUnion
} from './types/AST'
import { log, toSafeString } from './utils'

export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  return [
    options.bannerComment,
    declareNamedTypes(ast, options, ast.standaloneName!),
    declareNamedInterfaces(ast, options, ast.standaloneName!),
    declareEnums(ast, options)
  ]
    .filter(Boolean)
    .join('\n\n')
    + '\n' // trailing newline
}

function declareEnums(
  ast: AST,
  options: Options,
  processed = new Set<AST>()
): string {

  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)
  let type = ''

  switch (ast.type) {
    case 'ENUM':
      type = generateStandaloneEnum(ast, options) + '\n'
      break
    case 'ARRAY':
      return declareEnums(ast.params, options, processed)
    case 'TUPLE':
      return ast.params.reduce((prev, ast) => prev + declareEnums(ast, options, processed), '')
    case 'INTERFACE':
      type = getSuperTypesAndParams(ast).reduce((prev, ast) =>
        prev + declareEnums(ast, options, processed),
        '')
      break
    default:
      return ''
  }

  return type
}

function declareNamedInterfaces(
  ast: AST,
  options: Options,
  rootASTName: string,
  processed = new Set<AST>()
): string {

  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)
  let type = ''

  switch (ast.type) {
    case 'ARRAY':
      type = declareNamedInterfaces((ast as TArray).params, options, rootASTName, processed)
      break
    case 'INTERFACE':
      type = [
        hasStandaloneName(ast) && (ast.standaloneName === rootASTName || options.declareExternallyReferenced) && generateStandaloneInterface(ast, options),
        getSuperTypesAndParams(ast).map(ast =>
          declareNamedInterfaces(ast, options, rootASTName, processed)
        ).filter(Boolean).join('\n')
      ].filter(Boolean).join('\n')
      break
    case 'INTERSECTION':
    case 'TUPLE':
    case 'UNION':
      type = ast.params.map(_ => declareNamedInterfaces(_, options, rootASTName, processed)).filter(Boolean).join('\n')
      break
    default:
      type = ''
  }

  return type
}

function declareNamedTypes(
  ast: AST,
  options: Options,
  rootASTName: string,
  processed = new Set<AST>()
): string {

  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)
  let type = ''

  switch (ast.type) {
    case 'ARRAY':
      type = [
        declareNamedTypes(ast.params, options, rootASTName, processed),
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : undefined
      ].filter(Boolean).join('\n')
      break
    case 'ENUM':
      type = ''
      break
    case 'INTERFACE':
      type = getSuperTypesAndParams(ast).map(ast =>
        (ast.standaloneName === rootASTName || options.declareExternallyReferenced) && declareNamedTypes(ast, options, rootASTName, processed))
      .filter(Boolean).join('\n')
      break
    case 'INTERSECTION':
    case 'TUPLE':
    case 'UNION':
      type = [
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : undefined,
        ast.params.map(ast => declareNamedTypes(ast, options, rootASTName, processed)).filter(Boolean).join('\n')
      ].filter(Boolean).join('\n')
      break
    default:
      if (hasStandaloneName(ast)) {
        type = generateStandaloneType(ast, options)
      }
  }

  return type
}

function generateType(ast: AST, options: Options): string {
  log(whiteBright.bgMagenta('generator'), ast)

  if (hasStandaloneName(ast)) {
    return toSafeString(ast.standaloneName)
  }

  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return (() => {
      let type = generateType(ast.params, options)
      return type.endsWith('"') ? '(' + type + ')[]' : type + '[]'
    })()
    case 'BOOLEAN': return 'boolean'
    case 'INTERFACE': return generateInterface(ast, options)
    case 'INTERSECTION': return generateSetOperation(ast, options)
    case 'LITERAL': return JSON.stringify(ast.params)
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    case 'OBJECT': return 'object'
    case 'REFERENCE': return ast.params
    case 'STRING': return 'string'
    case 'TUPLE': return '['
      + ast.params.map(_ => generateType(_, options)).join(', ')
      + ']'
    case 'UNION': return generateSetOperation(ast, options)
    case 'CUSTOM_TYPE': return ast.params
  }
}

/**
 * Generate a Union or Intersection
 */
function generateSetOperation(ast: TIntersection | TUnion, options: Options): string {
  const members = (ast as TUnion).params.map(_ => generateType(_, options))
  const separator = ast.type === 'UNION' ? '|' : '&'
  return members.length === 1 ? members[0] : '(' + members.join(' ' + separator + ' ') + ')'
}

function generateInterface(
  ast: TInterface,
  options: Options
): string {
  return `{`
    + '\n'
    + ast.params
      .filter(_ => !_.isPatternProperty && !_.isUnreachableDefinition)
      .map(({ isRequired, keyName, ast }) => [isRequired, keyName, ast, generateType(ast, options)] as [boolean, string, AST, string])
      .map(([isRequired, keyName, ast, type]) =>
        (hasComment(ast) && !ast.standaloneName ? generateComment(ast.comment) + '\n' : '')
        + escapeKeyName(keyName)
        + (isRequired ? '' : '?')
        + ': '
        + (hasStandaloneName(ast) ? toSafeString(type) : type)
      )
      .join('\n')
    + '\n'
    + '}'
}

function generateComment(comment: string): string {
  return [
    '/**',
    ...comment.split('\n').map(_ => ' * ' + _),
    ' */'
  ].join('\n')
}

function generateStandaloneEnum(ast: TEnum, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment) + '\n' : '')
    + 'export ' + (options.enableConstEnums ? 'const ' : '') + `enum ${toSafeString(ast.standaloneName)} {`
    + '\n'
    + ast.params.map(({ ast, keyName }) =>
      keyName + ' = ' + generateType(ast, options)
    )
      .join(',\n')
    + '\n'
    + '}'
}

function generateStandaloneInterface(ast: TNamedInterface, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment) + '\n' : '')
    + `export interface ${toSafeString(ast.standaloneName)} `
    + (ast.superTypes.length > 0 ? `extends ${ast.superTypes.map(superType => toSafeString(superType.standaloneName)).join(', ')} ` : '')
    + generateInterface(ast, options)
}

function generateStandaloneType(ast: ASTWithStandaloneName, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment) + '\n' : '')
    + `export type ${toSafeString(ast.standaloneName)} = ${generateType(omit<AST>(ast, 'standaloneName') as AST /* TODO */, options)}`
}

function escapeKeyName(keyName: string): string {
  if (
    keyName.length
    && /[A-Za-z_$]/.test(keyName.charAt(0))
    && /^[\w$]+$/.test(keyName)
  ) {
    return keyName
  }
  if (keyName === '[k: string]') {
    return keyName
  }
  return JSON.stringify(keyName)
}

function getSuperTypesAndParams(ast: TInterface): AST[] {
  return ast.params
    .map(param => param.ast)
    .concat(ast.superTypes)
}
