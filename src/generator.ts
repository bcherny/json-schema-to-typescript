import { DEFAULT_OPTIONS, Options } from './index'
import { AST, TArray, TInterface, TIntersection, TTuple, TUnion } from './parser'

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return generate((ast as TArray).params, options) + '[]'
    case 'BOOLEAN': return 'boolean'
    // case 'ENUM'
    case 'INTERFACE': return generateInterface(ast as TInterface, options)
    case 'INTERSECTION': return generateSetOperation(ast as TIntersection, options)
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    // case 'OBJECT'
    // case 'REFERENCE'
    case 'STRING': return 'string'
    case 'TUPLE': return '[' + (ast as TTuple).params.map(_ => generate(_, options)).join(', ') + ']'
    case 'UNION': return generateSetOperation(ast as TUnion, options)
  }
}

/**
 * Generate a Union or Intersection
 */
function generateSetOperation(ast: TIntersection | TUnion, options: Options): string {
  const members = (ast as TUnion).params.map(_ => generate(_, options))
  const separator = ast.type === 'UNION' ? '|' : '&'
  return members.length === 1 ? members[0] : '(' + members.join(' ' + separator + ' ') + ')'
}

function generateInterface(ast: TInterface, options: Options): string {
  return (ast.comment ? generateComment(ast.comment, options, 0) : '')
    + `export interface ${ast.name} {`
    + '\n'
    + ast.params
        .map(_ => [_, generate(_, options)])
        .map(([ast, type]: [AST, string]) =>
          (ast.comment ? generateComment(ast.comment, options, 1) : '')
            + options.indentWith
            + ast.name
            + (ast.isRequired ? '' : '?')
            + ': '
            + type
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
