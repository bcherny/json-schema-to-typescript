import { whiteBright } from 'cli-color'
import { omit } from 'lodash'
import { DEFAULT_OPTIONS, Options } from './index'
import { AST, ASTWithStandaloneName, hasComment, hasStandaloneName, TEnum, TInterface, TIntersection, TNamedInterface, TUnion } from './types/AST'
import { log, toSafeString } from './utils'

export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  return [
    options.bannerComment,
    declareNamedTypes(ast, options),
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
    case 'INTERFACE':
      type = ast.params.reduce((prev, { ast }) =>
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
    case 'INTERFACE':
      type = [
        hasStandaloneName(ast) && (ast.standaloneName === rootASTName || options.declareReferenced) && generateStandaloneInterface(ast, options),
        ast.params.map(({ ast }) =>
          declareNamedInterfaces(ast, options, rootASTName, processed)
        ).filter(Boolean).join('\n')
      ].filter(Boolean).join('\n')
      break
    case 'INTERSECTION':
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
  processed = new Set<AST>()
): string {

  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)
  let type = ''

  switch (ast.type) {
    case 'ENUM':
      type = ''
      break
    case 'INTERFACE':
      type = ast.params.map(({ ast }) => declareNamedTypes(ast, options, processed)).filter(Boolean).join('\n')
      break
    case 'INTERSECTION':
    case 'UNION':

      if (hasStandaloneName(ast)) {
        type = generateStandaloneType(ast, options)
      }

      type = [
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : undefined,
        ast.params.map(ast => declareNamedTypes(ast, options, processed)).filter(Boolean).join('\n')
      ].filter(Boolean).join('\n')
      break
    default:
      if (hasStandaloneName(ast)) {
        type = generateStandaloneType(ast, options)
      }
  }

  return type
}

function generateType(ast: AST, options: Options, indentDepth: number): string {
  log(whiteBright.bgMagenta('generator'), ast)

  if (hasStandaloneName(ast)) {
    return toSafeString(ast.standaloneName)
  }

  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return generateType(ast.params, options, indentDepth + 1) + '[]'
    case 'BOOLEAN': return 'boolean'
    case 'INTERFACE': return generateInterface(ast, options, indentDepth + 1)
    case 'INTERSECTION': return generateSetOperation(ast, options, indentDepth)
    case 'LITERAL': return JSON.stringify(ast.params)
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    case 'OBJECT': return 'object'
    case 'REFERENCE': return ast.params
    case 'STRING': return 'string'
    case 'TUPLE': return '['
      + ast.params.map(_ => generateType(_, options, indentDepth + 1)).join(', ')
      + ']'
    case 'UNION': return generateSetOperation(ast, options, indentDepth)
  }
}

/**
 * Generate a Union or Intersection
 */
function generateSetOperation(ast: TIntersection | TUnion, options: Options, indentDepth: number): string {
  const members = (ast as TUnion).params.map(_ => generateType(_, options, indentDepth))
  const separator = ast.type === 'UNION' ? '|' : '&'
  return members.length === 1 ? members[0] : '(' + members.join(' ' + separator + ' ') + ')'
}

function generateInterface(
  ast: TInterface,
  options: Options,
  indentDepth: number
): string {
  return `{`
    + '\n'
    + options.indentWith.repeat(indentDepth)
    + ast.params
        .map(({ isRequired, keyName, ast }) => [isRequired, keyName, ast, generateType(ast, options, indentDepth)] as [boolean, string, AST, string])
        .map(([isRequired, keyName, ast, type]) =>
          (hasComment(ast) && !ast.standaloneName ? generateComment(ast.comment, options, indentDepth + 1) + '\n' : '')
            + options.indentWith
            + escapeKeyName(keyName)
            + (isRequired ? '' : '?')
            + ': '
            + (hasStandaloneName(ast) ? toSafeString(type) : type)
            + (options.enableTrailingSemicolonForInterfaceProperties ? ';' : '')
        )
        .join('\n' + options.indentWith.repeat(indentDepth))
    + '\n'
    + options.indentWith.repeat(indentDepth) + '}'
}

function generateComment(comment: string, options: Options, indentDepth: number): string {
  return options.indentWith.repeat(indentDepth)
    + [
        '/**',
        ...comment.split('\n').map(_ => ' * ' + _),
        ' */'
      ].join('\n' + options.indentWith.repeat(indentDepth))
}

function generateStandaloneEnum(ast: TEnum, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment, options, 0) + '\n' : '')
    + 'export ' + (options.enableConstEnums ? 'const ' : '') + `enum ${toSafeString(ast.standaloneName)} {`
    + '\n'
    + ast.params.map(({ ast, keyName }) =>
        options.indentWith
          + keyName
          + ' = '
          + generateType(ast, options, 0)
      )
      .join(',\n')
    + '\n'
    + '}'
}

function generateStandaloneInterface(ast: TNamedInterface, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment, options, 0) + '\n' : '')
    + `export interface ${toSafeString(ast.standaloneName)} `
    + generateInterface(ast, options, 0)
    + (options.enableTrailingSemicolonForInterfaces ? ';' : '')
}

function generateStandaloneType(ast: ASTWithStandaloneName, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment, options, 0) + '\n' : '')
    +  `export type ${toSafeString(ast.standaloneName)} = ${generateType(omit<ASTWithStandaloneName, AST>(ast, 'standaloneName'), options, 0)}`
    + (options.enableTrailingSemicolonForTypes ? ';' : '')
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
