import {uniqBy} from 'lodash'
import {Options} from '.'
import {generateType} from './generator'
import {AST, omitStandaloneName, T_ANY, T_UNKNOWN, TAny, TUnknown} from './types/AST'
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

      // [A & B & Unknown] -> [A & B], since a member that matches anything doesn't narrow an intersection
      if (optimizedAST.type === 'INTERSECTION') {
        const constrained = optimizedAST.params.filter(_ => _.type !== 'ANY' && _.type !== 'UNKNOWN')
        if (constrained.length > 0 && constrained.length < optimizedAST.params.length) {
          log('cyan', 'optimizer', '[A & B & Unknown] -> [A & B]', optimizedAST)
          optimizedAST.params = constrained
        }
      }

      // [A, B, C, Any] -> Any
      if (optimizedAST.params.some(_ => _.type === 'ANY')) {
        log('cyan', 'optimizer', '[A, B, C, Any] -> Any', optimizedAST)
        return collapsed(optimizedAST, T_ANY)
      }

      // [A, B, C, Unknown] -> Unknown
      if (optimizedAST.params.some(_ => _.type === 'UNKNOWN')) {
        log('cyan', 'optimizer', '[A, B, C, Unknown] -> Unknown', optimizedAST)
        return collapsed(optimizedAST, T_UNKNOWN)
      }

      // [A (named), A] -> [A (named)]
      // (`omitStandaloneName` returns a copy, which the memoized `generateType` has never seen
      // and so renders from scratch: check the cheap condition first, and render the first
      // member once rather than once per member)
      if (optimizedAST.params.some(_ => _.standaloneName !== undefined)) {
        const first = generateType(omitStandaloneName(optimizedAST.params[0]), options)
        if (optimizedAST.params.every(_ => generateType(omitStandaloneName(_), options) === first)) {
          log('cyan', 'optimizer', '[A (named), A] -> [A (named)]', optimizedAST)
          optimizedAST.params = optimizedAST.params.filter(_ => _.standaloneName !== undefined)
        }
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

/**
 * `ast` with its members gone: what names, documents and places it stays, so that a root (or
 * definition) whose set operation matches anything is still declared, as an alias
 */
function collapsed(ast: AST, to: TAny | TUnknown): AST {
  const {comment, deprecated, isUnreachableDefinition, keyName, standaloneName} = ast
  return {...to, comment, deprecated, isUnreachableDefinition, keyName, standaloneName}
}
