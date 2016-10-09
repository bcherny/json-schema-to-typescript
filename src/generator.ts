import { Options } from './index'
import { AST, TArray, TInterface } from './parser'

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options: Options): string {
  switch (ast.type) {
    case 'ANY': return 'any'
    case 'ARRAY': return generate((ast as TArray).params, options) + '[]'
    case 'BOOLEAN': return 'boolean'
    case 'INTERFACE': return generateInterface(ast as TInterface, options)
    case 'NUMBER': return 'number'
    case 'NULL': return 'null'
    case 'STRING': return 'string'
  }
}

function generateInterface(ast: TInterface, options: Options): string {
  return `export interface ${ast.keyName} {`
    + ast.params.map(_ =>  generate(_, options)).map(_ => options.indentWith + _)
    + '}'
    + (options.enableTrailingSemicolon ? ';' : '')
    + '\n'
}
