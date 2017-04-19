import { whiteBright } from 'cli-color'
import { omit } from 'lodash'
import { DEFAULT_OPTIONS, Options } from './index'
import { AST, ASTWithStandaloneName, hasComment, hasStandaloneName, TEnum, TInterface, TIntersection, TNamedInterface, TUnion } from './types/AST'
import { log, toSafeString } from './utils'

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  return [
    declareNamedTypes(ast, options),
    declareNamedInterfaces(ast, options, ast.standaloneName!),
    declareEnums(ast, options)
  ]
    .filter(Boolean)
    .join('\n')
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
      type = generateEnum(ast, options)
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
      let _interface = ''
      if (hasStandaloneName(ast) && (ast.standaloneName === rootASTName || options.declareReferenced)) {
        _interface = generateInterface(ast, options)
      }
      type = _interface
        + ast.params.map(({ ast }) => declareNamedInterfaces(ast, options, rootASTName, processed)).filter(Boolean).join('\n')
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
    case 'ARRAY': return generateType(ast.params, options) + '[]'
    case 'BOOLEAN': return 'boolean'
    case 'INTERFACE': return generateInlineInterface(ast, options)
    case 'INTERSECTION': return generateSetOperation(ast, options)
    case 'LITERAL': return JSON.stringify(ast.params)
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    case 'OBJECT': return 'object'
    case 'REFERENCE': return ast.params
    case 'STRING': return 'string'
    case 'TUPLE': return '[' + ast.params.map(_ => generateType(_, options)).join(', ') + ']'
    case 'UNION': return generateSetOperation(ast, options)
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

function generateEnum(ast: TEnum, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment, options, 0) : '')
    + 'export ' + (options.enableConstEnums ? 'const ' : '') + `enum ${toSafeString(ast.standaloneName)} {`
    + '\n'
    + ast.params.map(({ ast, keyName }) =>
        options.indentWith
          + keyName
          + ' = '
          + generateType(ast, options)
      )
      .join(',\n')
    + '\n'
    + '}'
    + '\n'
}

function generateInlineInterface(ast: TInterface, options: Options): string {
  return `{`
    + '\n'
    + ast.params
        .map(({ isRequired, keyName, ast }) => [isRequired, keyName, ast, generateType(ast, options)] as [boolean, string, AST, string])
        .map(([isRequired, keyName, ast, type]) =>
          (hasComment(ast) ? generateComment(ast.comment, options, 1) : '')
            + options.indentWith
            + keyName
            + (isRequired ? '' : '?')
            + ': '
            + (ast.type === 'ENUM' || ast.type === 'INTERFACE' ? toSafeString(type) : type)
            + (options.enableTrailingSemicolonForInterfaceProperties ? ';' : '')
        )
        .join('\n')
    + '\n'
    + '}'
}

function generateInterface(ast: TNamedInterface, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment, options, 0) : '')
    + `export interface ${toSafeString(ast.standaloneName)} `
    + generateInlineInterface(ast, options)
    + (options.enableTrailingSemicolonForInterfaces ? ';' : '')
    + '\n'
}

function generateComment(comment: string, options: Options, indentDepth: number): string {
  return options.indentWith.repeat(indentDepth)
    + [
        '/**',
        ...comment.split('\n').map(_ => ' * ' + _),
        ' */'
      ].join('\n' + options.indentWith.repeat(indentDepth))
    + '\n'
}

function generateStandaloneType(ast: ASTWithStandaloneName, options: Options): string {
  return `export type ${toSafeString(ast.standaloneName)} = ${generateType(omit<ASTWithStandaloneName, AST>(ast, 'standaloneName'), options)}`
    + (options.enableTrailingSemicolonForTypes ? ';' : '')
}
