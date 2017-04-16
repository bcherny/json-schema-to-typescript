import { whiteBright } from 'cli-color'
import { omit } from 'lodash'
import { DEFAULT_OPTIONS, Options } from './index'
import { AST, ASTWithName, ASTWithStandaloneName, hasComment, hasStandaloneName, TEnum, TInterface, TIntersection, TUnion } from './types/AST'
import { log, toSafeString } from './utils'

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  return [
    declareNamedTypes(ast, options),
    declareNamedInterfaces(ast, options, ast.standaloneName!),
    declareEnums(ast, options).join('')
  ]
    .filter(Boolean)
    .join('\n')
}

function declareEnums(ast: AST, options: Options): string[] {
  if (ast.type === 'ENUM') {
    return [generateEnum(ast as TEnum, options)]
  }
  if (ast.type === 'INTERFACE') {
    return (ast as TInterface).params
      .reduce<string[]>((prev, cur) => prev.concat(declareEnums(cur, options)), [])
      .filter(Boolean)
  }
  return []
}

function declareNamedInterfaces(ast: AST, options: Options, rootASTName: string): string {
  switch (ast.type) {
    case 'INTERFACE':
      return (
        hasStandaloneName(ast) && (ast.standaloneName === rootASTName || options.declareReferenced)
          ? generateInterface(ast, options)
          : ''
      ) + ast.params.map(_ => declareNamedInterfaces(_, options, rootASTName)).filter(Boolean).join('\n')
    default: return ''
  }
}

function declareNamedTypes(ast: AST, options: Options): string {
  switch (ast.type) {
    case 'ENUM': return ''
    case 'INTERFACE': return ast.params.map(_ => declareNamedTypes(_, options)).filter(Boolean).join('\n')
    default:
      if (hasStandaloneName(ast)) {
        return generateStandaloneType(ast, options)
      }
      return ''
  }
}

function generateType(ast: AST, options: Options): string {
  log(whiteBright.bgBlue('generator'), ast)

  if (hasStandaloneName(ast)) {
    return toSafeString(ast.standaloneName)
  }

  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return generateType(ast.params, options) + '[]'
    case 'BOOLEAN': return 'boolean'
    // case 'ENUM': return ast.standaloneName
    // case 'INTERFACE': return generateInterface(ast, options)
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
    + ast.params.map(_ =>
        options.indentWith
          + _.name
          + ' = '
          + generateType(_, options)
      )
      .join(',\n')
    + '\n'
    + '}'
    + '\n'
}

function generateInterface(ast: TInterface, options: Options): string {
  return (hasComment(ast) ? generateComment(ast.comment, options, 0) : '')
    + `export interface ${toSafeString(ast.standaloneName)} {`
    + '\n'
    + ast.params
        .map(_ => [_, generateType(_, options)])
        .map(([ast, type]: [ASTWithName, string]) =>
          (hasComment(ast) ? generateComment(ast.comment, options, 1) : '')
            + options.indentWith
            + ast.name
            + (ast.isRequired ? '' : '?')
            + ': '
            + (ast.type === 'ENUM' || ast.type === 'INTERFACE' ? toSafeString(type) : type)
            + (options.enableTrailingSemicolonForInterfaceProperties ? ';' : '')
        )
        .join('\n')
    + '\n'
    + '}'
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
