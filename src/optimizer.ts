import {uniqBy} from 'lodash'
import {Options} from '.'
import {generateType} from './generator'
import {AST, omitStandaloneName, T_ANY, T_UNKNOWN} from './types/AST'
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

      // [A] -> A is the generator's job (it prints a one-member set operation as that member):
      // nothing below has two members to work with, and trading the node for a bare `any`
      // would lose the member's name and the comment of whatever holds it
      if (optimizedAST.params.length === 1) {
        return optimizedAST
      }

      // [A & B & Unknown] -> [A & B], since a member that matches anything doesn't narrow an intersection
      if (optimizedAST.type === 'INTERSECTION') {
        const constrained = optimizedAST.params.filter(_ => !matchesAnything(_))
        if (constrained.length > 0 && constrained.length < optimizedAST.params.length) {
          log('cyan', 'optimizer', '[A & B & Unknown] -> [A & B]', optimizedAST)
          optimizedAST.params = constrained
        }
      }

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
 * `any`, `unknown`, or a set operation over nothing but those (which is printed as its member) --
 * not one with no members at all, which the generator prints as an open object or `never`. A set
 * operation can be its own member (`allOf: [{$ref: '#'}]`): one met again matches nothing more.
 */
function matchesAnything(ast: AST, seen = new Set<AST>()): boolean {
  switch (ast.type) {
    case 'ANY':
    case 'UNKNOWN':
      return true
    case 'INTERSECTION':
    case 'UNION':
      if (seen.has(ast)) {
        return false
      }
      seen.add(ast)
      return ast.params.length > 0 && ast.params.every(_ => matchesAnything(_, seen))
    default:
      return false
  }
}
