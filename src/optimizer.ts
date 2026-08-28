import {uniqBy} from 'lodash'
import {Options} from '.'
import {generateType} from './generator'
import {AST, omitStandaloneName, T_ANY, T_UNKNOWN} from './types/AST'
import {log} from './utils'

// nodes whose optimize() has returned; a recursive type can be rendered from inside itself before that
const settled = new WeakSet<AST>()

export function optimize(ast: AST, options: Options, processed = new Set<AST>()): AST {
  if (processed.has(ast)) {
    return ast
  }

  processed.add(ast)
  const optimized = optimizeNode(ast, options, processed)
  settled.add(ast)
  return optimized
}

function optimizeNode(ast: AST, options: Options, processed: Set<AST>): AST {
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
        return T_ANY
      }

      // [A, B, C, Unknown] -> Unknown
      if (optimizedAST.params.some(_ => _.type === 'UNKNOWN')) {
        log('cyan', 'optimizer', '[A, B, C, Unknown] -> Unknown', optimizedAST)
        return T_UNKNOWN
      }

      // [A (named), A] -> [A (named)]
      if (optimizedAST.params.some(_ => _.standaloneName !== undefined)) {
        const [first, ...rest] = optimizedAST.params
        const type = generateStructuralType(first, options)
        if (rest.every(_ => generateStructuralType(_, options) === type)) {
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

const structuralTypes = new WeakMap<AST, string>()

/**
 * The type `ast` renders as with its standalone name left out. `omitStandaloneName` returns a
 * copy that the memoized `generateType` has never seen, so that is a full render every time, and
 * the same named type sits in many unions: keep the result, once the node is settled.
 */
function generateStructuralType(ast: AST, options: Options): string {
  const cached = structuralTypes.get(ast)
  if (cached !== undefined) {
    return cached
  }
  const type = generateType(omitStandaloneName(ast), options)
  if (settled.has(ast) && !rendersFromOtherNodes(ast)) {
    structuralTypes.set(ast, type)
  }
  return type
}

/**
 * An interface with a typed index signature widens that signature over the *current* members of its
 * sibling and supertype properties (generateIndexSignatureType), and the optimizer can still rewrite
 * those after this node has settled -- a supertype it has not reached yet, an enclosing union it is
 * part-way through -- so its structural render is not a function of this node alone. (Everything
 * else a render reads is either this node's own fields or a child's memoized render.)
 */
function rendersFromOtherNodes(ast: AST): boolean {
  return (
    ast.type === 'INTERFACE' &&
    ast.params.some(_ => _.isIndexSignature && _.ast.type !== 'ANY' && _.ast.type !== 'UNKNOWN')
  )
}
