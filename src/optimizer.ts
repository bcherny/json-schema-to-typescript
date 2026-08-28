import {uniqBy} from 'lodash'
import {Options} from '.'
import {generateType} from './generator'
import {
  AST,
  hasStandaloneName,
  omitStandaloneName,
  T_ANY,
  T_UNKNOWN,
  TAny,
  TIntersection,
  TUnion,
  TUnknown,
} from './types/AST'
import {log} from './utils'

// nodes whose optimize() has returned; a recursive type can be rendered from inside itself before that
const settled = new WeakSet<AST>()

/**
 * `processed` maps each node already visited to what it optimized to, so that a node reached
 * from several places (a definition with more than one referrer) optimizes to one node, not one
 * per referrer -- which matters when the result is a new node rather than the input, mutated
 */
export function optimize(ast: AST, options: Options, processed = new Map<AST, AST>()): AST {
  if (processed.has(ast)) {
    return processed.get(ast)!
  }
  processed.set(ast, ast) // a node reached again through itself (a cycle) stays as it is
  const optimized = optimizeNode(ast, options, processed)
  processed.set(ast, optimized)
  settled.add(ast).add(optimized)
  return optimized
}

function optimizeNode(ast: AST, options: Options, processed: Map<AST, AST>): AST {
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

      // [A | (B | C)] -> [A | B | C]: an unnamed set operation of the same kind, nested, only adds
      // parentheses -- its members accept exactly what they accept one level up
      const nested = (_: AST): _ is TIntersection | TUnion =>
        _.type === optimizedAST.type && !hasStandaloneName(_) && _ !== optimizedAST
      if (optimizedAST.params.some(nested)) {
        log('cyan', 'optimizer', '[A | (B | C)] -> [A | B | C]', optimizedAST)
        optimizedAST.params = optimizedAST.params.flatMap(_ => (nested(_) ? _.params : [_]))
      }

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
        return collapsed(optimizedAST, T_ANY)
      }

      // [A, B, C, Unknown] -> Unknown
      if (optimizedAST.params.some(_ => _.type === 'UNKNOWN')) {
        log('cyan', 'optimizer', '[A, B, C, Unknown] -> Unknown', optimizedAST)
        return collapsed(optimizedAST, T_UNKNOWN)
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

/**
 * `ast` with its members gone: what names, documents and places it stays, so that a root (or
 * definition) whose set operation matches anything is still declared, as an alias
 */
function collapsed(ast: AST, to: TAny | TUnknown): AST {
  const {comment, deprecated, isUnreachableDefinition, keyName, standaloneName} = ast
  return {...to, comment, deprecated, isUnreachableDefinition, keyName, standaloneName}
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
