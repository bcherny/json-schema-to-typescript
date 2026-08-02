import {uniqBy} from 'lodash'
import {Options} from '.'
import {generateType} from './generator'
import {AST, hasStandaloneName, T_ANY, T_UNKNOWN} from './types/AST'
import {log} from './utils'

export function optimize(ast: AST, options: Options, processed = new Set<AST>()): AST {
  if (processed.has(ast)) {
    return ast
  }

  processed.add(ast)

  switch (ast.type) {
    case 'ARRAY':
      return Object.assign(ast, {
        params: optimize(ast.params, options, processed),
      })
    case 'INTERFACE':
      return Object.assign(ast, {
        params: ast.params.map(_ => Object.assign(_, {ast: optimize(_.ast, options, processed)})),
      })
    case 'INTERSECTION':
    case 'UNION':
      // Start with the leaves...
      const optimizedAST = Object.assign(ast, {
        params: ast.params.map(_ => optimize(_, options, processed)),
      })

      // [A, B, C, Any] -> Any
      if (optimizedAST.params.some(_ => _.type === 'ANY')) {
        log('cyan', 'optimizer', '[A, B, C, Any] -> Any', optimizedAST)
        return T_ANY
      }

      // [A, B, C, Unknown] -> Unknown
      if (optimizedAST.params.some(_ => _.type === 'UNKNOWN')) {
        log('cyan', 'optimizer', '[A, B, C, Unknown] -> Unknown', optimizedAST)
        return T_UNKNOWN
      }

      if (hasAnonymousCycle(optimizedAST)) {
        return optimizedAST
      }

      // [A (named), A] -> [A (named)]
      if (
        optimizedAST.params.every(_ => {
          const a = generateType(omitStandaloneName(_), options)
          const b = generateType(omitStandaloneName(optimizedAST.params[0]), options)
          return a === b
        }) &&
        optimizedAST.params.some(_ => _.standaloneName !== undefined)
      ) {
        log('cyan', 'optimizer', '[A (named), A] -> [A (named)]', optimizedAST)
        optimizedAST.params = optimizedAST.params.filter(_ => _.standaloneName !== undefined)
      }

      // [A, B, B] -> [A, B]
      const params = uniqBy(optimizedAST.params, _ => generateType(_, options))
      if (params.length !== optimizedAST.params.length) {
        log('cyan', 'optimizer', '[A, B, B] -> [A, B]', optimizedAST)
        optimizedAST.params = params
      }

      return Object.assign(optimizedAST, {
        params: optimizedAST.params.map(_ => optimize(_, options, processed)),
      })
    default:
      return ast
  }
}

// TODO: More clearly disambiguate standalone names vs. aliased names instead.
function omitStandaloneName<A extends AST>(ast: A): A {
  switch (ast.type) {
    case 'ENUM':
      return ast
    default:
      return {...ast, standaloneName: undefined}
  }
}

function hasAnonymousCycle(ast: AST, processed = new Set<AST>(), processing = new Set<AST>()): boolean {
  if (processing.has(ast)) {
    return !hasStandaloneName(ast)
  }

  if (processed.has(ast)) {
    return false
  }

  processing.add(ast)

  const check = (ast: AST) => hasAnonymousCycle(ast, processed, processing)
  let result = false

  switch (ast.type) {
    case 'ARRAY':
      result = check(ast.params)
      break
    case 'INTERFACE':
      result = ast.params.some(param => check(param.ast)) || ast.superTypes.some(check)
      break
    case 'INTERSECTION':
    case 'UNION':
      result = ast.params.some(check)
      break
    case 'TUPLE':
      result = ast.params.some(check) || Boolean(ast.spreadParam && check(ast.spreadParam))
      break
  }

  processing.delete(ast)
  processed.add(ast)
  return result
}
