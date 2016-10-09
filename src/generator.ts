import { AST, AST_TYPE, TInterface } from './parser'

export interface Options {
  enableTrailingSemicolon: boolean
  indentWith: string
}

// TODO: call for referenced types
// TODO: use discriminated union types to prevent asserts
export function generate(ast: AST, options: Options): string {
  switch (ast.type) {
    case AST_TYPE.BOOLEAN: return 'boolean'
    case AST_TYPE.INTERFACE: return generateInterface(ast as TInterface, options)
    case AST_TYPE.NUMBER: return 'number'
    case AST_TYPE.STRING: return 'string'
  }
}

function generateInterface(ast: TInterface, options: Options): string {
  return `export interface ${ast.keyName} {`
    + ast.value.map(_ =>  generate(_, options)).map(_ => options.indentWith + _)
    + '}'
    + (options.enableTrailingSemicolon ? ';' : '')
    + '\n'
}
