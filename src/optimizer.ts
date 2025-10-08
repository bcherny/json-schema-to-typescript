import {uniqBy} from 'lodash'
import {Options} from '.'
import {generateType} from './generator'
import {AST, T_ANY, T_UNKNOWN} from './types/AST'
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

      // For INTERSECTION: simplify A & (A | null) -> A | null
      // Also handle cases where intersection contains duplicate types
      if (ast.type === 'INTERSECTION') {
        // First, handle the A & (A | null) -> A | null pattern
        if (optimizedAST.params.length === 2) {
          const [first, second] = optimizedAST.params

          // Check if one is INTERFACE and the other is UNION containing that INTERFACE
          if (first.type === 'INTERFACE' && second.type === 'UNION') {
            const firstType = generateType(first, options)
            // Look for an interface member in the union that matches first
            for (const unionParam of second.params) {
              if (unionParam.type === 'INTERFACE') {
                const unionParamType = generateType(unionParam, options)
                if (firstType === unionParamType) {
                  // Found a match - check if the rest of the union is just adding null or similar
                  const otherMembers = second.params.filter(_ => _ !== unionParam)
                  if (otherMembers.length > 0) {
                    log('cyan', 'optimizer', 'A & (A | ...) -> A | ...', optimizedAST)
                    // Preserve standaloneName, keyName, comment from the intersection
                    return {
                      ...second,
                      standaloneName: optimizedAST.standaloneName,
                      keyName: optimizedAST.keyName,
                      comment: optimizedAST.comment,
                      deprecated: optimizedAST.deprecated,
                    }
                  }
                }
              }
            }
          }

          // Check the reverse: (A | ...) & A -> A | ...
          if (second.type === 'INTERFACE' && first.type === 'UNION') {
            const secondType = generateType(second, options)
            // Look for an interface member in the union that matches second
            for (const unionParam of first.params) {
              if (unionParam.type === 'INTERFACE') {
                const unionParamType = generateType(unionParam, options)
                if (secondType === unionParamType) {
                  // Found a match - check if the rest of the union is just adding null or similar
                  const otherMembers = first.params.filter(_ => _ !== unionParam)
                  if (otherMembers.length > 0) {
                    log('cyan', 'optimizer', '(A | ...) & A -> A | ...', optimizedAST)
                    // Preserve standaloneName, keyName, comment from the intersection
                    return {
                      ...first,
                      standaloneName: optimizedAST.standaloneName,
                      keyName: optimizedAST.keyName,
                      comment: optimizedAST.comment,
                      deprecated: optimizedAST.deprecated,
                    }
                  }
                }
              }
            }
          }
        }

        // Second, handle intersections with more than 2 members that contain duplicates
        // This handles cases like A & B & A & B -> A & B
        if (optimizedAST.params.length > 2) {
          const uniqueParams = uniqBy(optimizedAST.params, _ => generateType(_, options))
          if (uniqueParams.length < optimizedAST.params.length) {
            log('cyan', 'optimizer', 'Intersection with duplicates simplified', optimizedAST)
            optimizedAST.params = uniqueParams

            // If we're left with just 1 param, return it directly
            if (uniqueParams.length === 1) {
              log('cyan', 'optimizer', 'Single-member intersection unwrapped', optimizedAST)
              return uniqueParams[0]
            }
          }
        }
      }

      // Params were already optimized at line 27, so just return
      return optimizedAST
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
