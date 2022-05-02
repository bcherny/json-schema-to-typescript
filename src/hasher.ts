import {Options} from '.'
import {generateInterfaceParam, generateType} from './generator'
import {AST} from './types/AST'

export function hash(ast: AST, options: Options): string {
  switch (ast.type) {
    case 'ANY':
      return 'any'
    case 'BOOLEAN':
      return 'boolean'
    case 'INTERSECTION':
    case 'UNION':
      return `(${ast.params.map(_ => _.hashCode).join(', ')})`
    case 'CUSTOM_TYPE':
      return ast.params
    case 'ENUM':
      return `(${ast.params.map(_ => `${_.keyName}:${_.ast.hashCode}`).join(', ')})`
    case 'INTERFACE':
      return `(${generateType(ast, options)})`
    case 'INTERFACE_PARAM':
      return generateInterfaceParam(ast, options)
    case 'ARRAY':
      return hash(ast.params, options)
    case 'NUMBER':
      return 'number'
    case 'NULL':
      return 'null'
    case 'OBJECT':
      return 'object'
    case 'LITERAL':
    case 'STRING':
    case 'UNKNOWN':
    case 'REFERENCE':
    case 'TUPLE':
      return generateType(ast, options)
  }
}
