import {uniqBy} from 'lodash'
import {AST, T_ANY, T_UNKNOWN} from './types/AST'
import {log} from './utils'

export function optimize(ast: AST, processed = new Set<AST>()): AST {
  log('cyan', 'optimizer', ast, processed.has(ast) ? '(FROM CACHE)' : '')

  if (processed.has(ast)) {
    return ast
  }

  processed.add(ast)

  switch (ast.type) {
    case 'INTERFACE':
      return Object.assign(ast, {
        params: ast.params.map(_ => Object.assign(_, {ast: optimize(_.ast, processed)}))
      })
    case 'INTERSECTION':
    case 'UNION':
      // [A, B, C, Any] -> Any
      if (ast.params.some(_ => _.type === 'ANY')) {
        log('cyan', 'optimizer', '[A, B, C, Any] -> Any', ast)
        return T_ANY
      }

      // [A, B, C, Unknown] -> Unknown
      if (ast.params.some(_ => _.type === 'UNKNOWN')) {
        log('cyan', 'optimizer', '[A, B, C, Unknown] -> Unknown', ast)
        return T_UNKNOWN
      }

      // [A (named), A] -> [A (named)]
      if (
        ast.params.every(_ => _.hashCode === ast.params[0].hashCode) &&
        ast.params.some(_ => _.standaloneName !== undefined)
      ) {
        log('cyan', 'optimizer', '[A, B, B] -> [A, B]', ast)
        ast.params = ast.params.filter(_ => _.standaloneName !== undefined)
      }

      // [A, B, B] -> [A, B]
      const params = uniqBy(ast.params, _ => `${_.standaloneName}:${_.hashCode}`)
      if (params.length !== ast.params.length) {
        log('cyan', 'optimizer', '[A, B, B] -> [A, B]', ast)
        ast.params = params
      }

      return Object.assign(ast, {
        params: ast.params.map(_ => optimize(_, processed))
      })
    default:
      return ast
  }
}
