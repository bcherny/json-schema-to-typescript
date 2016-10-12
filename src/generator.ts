import { DEFAULT_OPTIONS, Options } from './index'
import { AST, TArray, TInterface, TIntersection, TTuple, TUnion } from './parser'

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  console.log('generate', ast)
  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return generate((ast as TArray).params, options) + '[]'
    case 'BOOLEAN': return 'boolean'
    // case 'ENUM'
    case 'INTERFACE': return generateInterface(ast as TInterface, options)
    case 'INTERSECTION': return (ast as TIntersection).params.map(_ => generate(_, options)).join(' & ')
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    // case 'OBJECT'
    // case 'REFERENCE'
    case 'STRING': return 'string'
    case 'TUPLE': return '[' + (ast as TTuple).params.map(_ => generate(_, options)).join(', ') + ']'
    case 'UNION': return (ast as TUnion).params.map(_ => generate(_, options)).join(' | ')
  }
}

function generateInterface(ast: TInterface, options: Options): string {
  return `export interface ${ast.name} {`
    + '\n'
    + ast.params
        .map(_ => [_, generate(_, options)])
        .map(([ast, type]: [AST, string]) =>
          options.indentWith
            + ast.name
            + (ast.isRequired ? '' : '?')
            + ': '
            + type
            + (options.enableTrailingSemicolon ? ';' : '')
        )
        .join('\n')
    + '}'
    + (options.enableTrailingSemicolon ? ';' : '')
    + '\n'
}
