import { DEFAULT_OPTIONS, Options } from './index'
import { AST, TArray, TEnum, TInterface, TIntersection, TLiteral, TTuple, TUnion, hasComment, ASTWithName } from './types/AST'
import { toSafeString } from './utils'

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  return declareNamedInterfaces(ast, options)
    + declareEnums(ast, options).join('')
    + generateType(ast, options)
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

function declareNamedInterfaces(ast: AST, options: Options): string {
  return ''
}

function generateType(ast: AST, options: Options): string {
  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return generateType((ast as TArray).params, options) + '[]'
    case 'BOOLEAN': return 'boolean'
    case 'ENUM': return ast.name
    case 'INTERFACE': return generateInterface(ast as TInterface, options)
    case 'INTERSECTION': return generateSetOperation(ast as TIntersection, options)
    case 'LITERAL': return JSON.stringify((ast as TLiteral).params)
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    // case 'OBJECT'
    // case 'REFERENCE'
    case 'STRING': return 'string'
    case 'TUPLE': return '[' + (ast as TTuple).params.map(_ => generateType(_, options)).join(', ') + ']'
    case 'UNION': return generateSetOperation(ast as TUnion, options)
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
    + 'export ' + (options.enableConstEnums ? 'const ' : '') + `enum ${toSafeString(ast.name)} {`
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
    + `export interface ${toSafeString(ast.name)} {`
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
