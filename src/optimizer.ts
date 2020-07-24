import stringify = require('json-stringify-safe')
import {uniqBy} from 'lodash'
import {AST, T_ANY} from './types/AST'
import {log, joinStrings} from './utils'

export function optimize(ast: AST, processed = new Set<AST>()): AST {
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
      // [A] -> A
      if (ast.params.length === 1) {
        log('cyan', 'optimizer', '[A] -> A', ast)
        ast.params[0].comment = joinStrings(ast.comment, ast.params[0].comment)
        return optimize(ast.params[0], processed)
      }

      // [A, B, C, Any] -> Any
      if (ast.params.map(_ => optimize(_, processed)).some(_ => _.type === 'ANY')) {
        log('cyan', 'optimizer', '[A, B, C, Any] -> Any', ast)
        return T_ANY
      }

      // [A, B, B] -> [A, B]
      const shouldTakeStandaloneNameIntoAccount =
        ast.params.map(_ => optimize(_, processed)).filter(_ => _.standaloneName).length > 1
      const params = uniqBy(
        ast.params,
        _ => `
          ${_.type}-
          ${shouldTakeStandaloneNameIntoAccount ? _.standaloneName : ''}-
          ${stringify((_ as any).params)}
        `
      )
      if (ast.params.length !== params.length) {
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
