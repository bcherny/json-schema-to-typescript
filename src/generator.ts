import {omit} from 'lodash'
import {memoize} from './memoize'
import {DEFAULT_OPTIONS, Options} from './index'
import {
  AST,
  ASTWithStandaloneName,
  hasComment,
  hasStandaloneName,
  T_ANY,
  TArray,
  TEnum,
  TInterface,
  TInterfaceParam,
  TIntersection,
  TNamedInterface,
  TUnion,
  T_UNKNOWN,
} from './types/AST'
import {log, toSafeString} from './utils'

export function generate(ast: AST, options = DEFAULT_OPTIONS): string {
  return (
    [
      options.bannerComment,
      declareNamedTypes(ast, options, ast.standaloneName!),
      declareNamedInterfaces(ast, options, ast.standaloneName!),
      declareEnums(ast, options),
    ]
      .filter(Boolean)
      .join('\n\n') + '\n'
  ) // trailing newline
}

function declareEnums(ast: AST, options: Options, processed = new Set<AST>()): string {
  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)
  let type = ''

  switch (ast.type) {
    case 'ENUM':
      return generateStandaloneEnum(ast, options) + '\n'
    case 'ARRAY':
      return declareEnums(ast.params, options, processed)
    case 'UNION':
    case 'INTERSECTION':
      return ast.params.reduce((prev, ast) => prev + declareEnums(ast, options, processed), '')
    case 'TUPLE':
      type = ast.params.reduce((prev, ast) => prev + declareEnums(ast, options, processed), '')
      if (ast.spreadParam) {
        type += declareEnums(ast.spreadParam, options, processed)
      }
      return type
    case 'INTERFACE':
      return getSuperTypesAndParams(ast).reduce((prev, ast) => prev + declareEnums(ast, options, processed), '')
    default:
      return ''
  }
}

function declareNamedInterfaces(ast: AST, options: Options, rootASTName: string, processed = new Set<AST>()): string {
  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)
  let type = ''

  switch (ast.type) {
    case 'ARRAY':
      type = declareNamedInterfaces((ast as TArray).params, options, rootASTName, processed)
      break
    case 'INTERFACE':
      type = [
        hasStandaloneName(ast) &&
          (ast.standaloneName === rootASTName || options.declareExternallyReferenced) &&
          generateStandaloneInterface(ast, options),
        getSuperTypesAndParams(ast)
          .map(ast => declareNamedInterfaces(ast, options, rootASTName, processed))
          .filter(Boolean)
          .join('\n'),
      ]
        .filter(Boolean)
        .join('\n')
      break
    case 'INTERSECTION':
    case 'TUPLE':
    case 'UNION':
      type = ast.params
        .map(_ => declareNamedInterfaces(_, options, rootASTName, processed))
        .filter(Boolean)
        .join('\n')
      if (ast.type === 'TUPLE' && ast.spreadParam) {
        type += declareNamedInterfaces(ast.spreadParam, options, rootASTName, processed)
      }
      break
    default:
      type = ''
  }

  return type
}

function declareNamedTypes(ast: AST, options: Options, rootASTName: string, processed = new Set<AST>()): string {
  if (processed.has(ast)) {
    return ''
  }

  processed.add(ast)

  switch (ast.type) {
    case 'ARRAY':
      return [
        declareNamedTypes(ast.params, options, rootASTName, processed),
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : undefined,
      ]
        .filter(Boolean)
        .join('\n')
    case 'ENUM':
      return ''
    case 'INTERFACE':
      return getSuperTypesAndParams(ast)
        .map(
          ast =>
            (ast.standaloneName === rootASTName || options.declareExternallyReferenced) &&
            declareNamedTypes(ast, options, rootASTName, processed),
        )
        .filter(Boolean)
        .join('\n')
    case 'INTERSECTION':
    case 'TUPLE':
    case 'UNION':
      return [
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : undefined,
        ast.params
          .map(ast => declareNamedTypes(ast, options, rootASTName, processed))
          .filter(Boolean)
          .join('\n'),
        'spreadParam' in ast && ast.spreadParam
          ? declareNamedTypes(ast.spreadParam, options, rootASTName, processed)
          : undefined,
      ]
        .filter(Boolean)
        .join('\n')
    default:
      if (hasStandaloneName(ast)) {
        return generateStandaloneType(ast, options)
      }
      return ''
  }
}

function generateTypeUnmemoized(ast: AST, options: Options): string {
  const type = generateRawType(ast, options)

  if (options.strictIndexSignatures && ast.keyName === '[k: string]') {
    return `${type} | undefined`
  }

  return type
}
export const generateType = memoize(generateTypeUnmemoized)

function generateRawType(ast: AST, options: Options): string {
  log('magenta', 'generator', ast)

  if (hasStandaloneName(ast)) {
    return toSafeString(ast.standaloneName)
  }

  switch (ast.type) {
    case 'ANY':
      return 'any'
    case 'ARRAY':
      return (() => {
        const type = generateType(ast.params, options)
        return type.endsWith('"') ? '(' + type + ')[]' : type + '[]'
      })()
    case 'BOOLEAN':
      return 'boolean'
    case 'INTERFACE':
      return generateInterface(ast, options)
    case 'INTERSECTION':
      return generateSetOperation(ast, options)
    case 'LITERAL':
      return JSON.stringify(ast.params)
    case 'NEVER':
      return 'never'
    case 'NUMBER':
      return 'number'
    case 'NULL':
      return 'null'
    case 'OBJECT':
      return 'object'
    case 'REFERENCE':
      return ast.params
    case 'STRING':
      return 'string'
    case 'TUPLE':
      return (() => {
        const minItems = ast.minItems
        const maxItems = ast.maxItems || -1

        let spreadParam = ast.spreadParam
        const astParams = [...ast.params]
        if (minItems > 0 && minItems > astParams.length && ast.spreadParam === undefined) {
          // this is a valid state, and JSONSchema doesn't care about the item type
          if (maxItems < 0) {
            // no max items and no spread param, so just spread any
            spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY
          }
        }
        if (maxItems > astParams.length && ast.spreadParam === undefined) {
          // this is a valid state, and JSONSchema doesn't care about the item type
          // fill the tuple with any elements
          for (let i = astParams.length; i < maxItems; i += 1) {
            astParams.push(options.unknownAny ? T_UNKNOWN : T_ANY)
          }
        }

        function addSpreadParam(params: string[]): string[] {
          if (spreadParam) {
            const spread = '...(' + generateType(spreadParam, options) + ')[]'
            params.push(spread)
          }
          return params
        }

        function paramsToString(params: string[]): string {
          return '[' + params.join(', ') + ']'
        }

        const paramsList = astParams.map(param => generateType(param, options))

        if (paramsList.length > minItems) {
          /*
        if there are more items than the min, we return a union of tuples instead of
        using the optional element operator. This is done because it is more typesafe.

        // optional element operator
        type A = [string, string?, string?]
        const a: A = ['a', undefined, 'c'] // no error

        // union of tuples
        type B = [string] | [string, string] | [string, string, string]
        const b: B = ['a', undefined, 'c'] // TS error
        */

          const cumulativeParamsList: string[] = paramsList.slice(0, minItems)
          const typesToUnion: string[] = []

          if (cumulativeParamsList.length > 0) {
            // actually has minItems, so add the initial state
            typesToUnion.push(paramsToString(cumulativeParamsList))
          } else {
            // no minItems means it's acceptable to have an empty tuple type
            typesToUnion.push(paramsToString([]))
          }

          for (let i = minItems; i < paramsList.length; i += 1) {
            cumulativeParamsList.push(paramsList[i])

            if (i === paramsList.length - 1) {
              // only the last item in the union should have the spread parameter
              addSpreadParam(cumulativeParamsList)
            }

            typesToUnion.push(paramsToString(cumulativeParamsList))
          }

          return typesToUnion.join('|')
        }

        // no max items so only need to return one type
        return paramsToString(addSpreadParam(paramsList))
      })()
    case 'UNION':
      return generateSetOperation(ast, options)
    case 'UNKNOWN':
      return 'unknown'
    case 'CUSTOM_TYPE':
      return ast.params
  }
}

/**
 * Generate a Union or Intersection
 */
function generateSetOperation(ast: TIntersection | TUnion, options: Options): string {
  const members = (ast as TUnion).params.map(_ => generateType(_, options))
  const separator = ast.type === 'UNION' ? '|' : '&'
  return members.length === 1 ? members[0] : '(' + members.join(' ' + separator + ' ') + ')'
}

/**
 * True for types that already accept every other type, making index-signature
 * widening unnecessary. Checks the AST (not the rendered string) so named aliases
 * of `any`/`unknown` are recognized too; `tsType` overrides are compared textually
 * since they are opaque.
 */
function isAnyOrUnknown(ast: AST): boolean {
  if (ast.type === 'ANY' || ast.type === 'UNKNOWN') {
    return true
  }
  if (ast.type === 'CUSTOM_TYPE') {
    const type = ast.params.trim()
    return type === 'any' || type === 'unknown'
  }
  return false
}

/**
 * Named properties (own and inherited) that TypeScript checks against an interface's
 * index signature.
 */
function getIndexSignatureSiblings(
  params: TInterfaceParam[],
  indexSignature: TInterfaceParam,
  superTypes: TNamedInterface[],
): TInterfaceParam[] {
  const siblings = params.filter(_ => _ !== indexSignature)
  const visited = new Set<TNamedInterface>()
  function collectInherited(superTypes: TNamedInterface[]): void {
    for (const superType of superTypes) {
      if (visited.has(superType)) {
        continue
      }
      visited.add(superType)
      siblings.push(
        ...superType.params.filter(_ => !_.isPatternProperty && !_.isUnreachableDefinition && !_.isIndexSignature),
      )
      collectInherited(superType.superTypes)
    }
  }
  collectInherited(superTypes)
  return siblings
}

// Types that render without recursing into other ASTs.
const LEAF_TYPES = new Set<AST['type']>([
  'BOOLEAN',
  'CUSTOM_TYPE',
  'LITERAL',
  'NEVER',
  'NULL',
  'NUMBER',
  'OBJECT',
  'REFERENCE',
  'STRING',
])

/**
 * TypeScript requires every named property's type to be assignable to the interface's
 * index signature type (TS2411), including properties inherited via `extends`. Widen
 * the index signature's type into a union that also covers the named properties'
 * types — `T | undefined` for optional properties, since that is the type TypeScript
 * checks them against.
 *
 * Operates on ASTs rather than generated strings so members are deduplicated and
 * rendered by the normal generator machinery. Returns undefined when no widening is
 * needed and the index signature should render its own type as usual.
 */
function generateIndexSignatureType(
  indexSignature: TInterfaceParam,
  params: TInterfaceParam[],
  superTypes: TNamedInterface[],
  options: Options,
): string | undefined {
  if (isAnyOrUnknown(indexSignature.ast)) {
    return undefined
  }

  const memberASTs: AST[] = []
  function addMember(ast: AST): void {
    // flatten anonymous unions so their members participate in deduplication
    if (ast.type === 'UNION' && !hasStandaloneName(ast)) {
      ast.params.forEach(addMember)
      return
    }
    // also flatten tsType unions, but only when provably safe to split: nothing
    // but identifier characters, whitespace, and `|` (no brackets, quotes,
    // arrows, or other constructs that would require real parsing)
    if (ast.type === 'CUSTOM_TYPE' && ast.params.includes('|') && /^[\w$.\s|]+$/.test(ast.params)) {
      for (const member of ast.params.split('|')) {
        const trimmed = member.trim()
        if (trimmed) {
          memberASTs.push({type: 'CUSTOM_TYPE', params: trimmed})
        }
      }
      return
    }
    memberASTs.push(ast)
  }

  addMember(indexSignature.ast)
  let needsUndefined = options.strictIndexSignatures
  for (const sibling of getIndexSignatureSiblings(params, indexSignature, superTypes)) {
    if (sibling.ast.type === 'ANY') {
      // `any` (even when optional) is assignable to every index signature type
      continue
    }
    if (!sibling.isRequired) {
      needsUndefined = true
    }
    if (sibling.ast.type === 'NEVER') {
      continue
    }
    addMember(sibling.ast)
  }

  if (memberASTs.some(_ => _.type === 'UNKNOWN')) {
    // `unknown` absorbs every other member
    return 'unknown'
  }

  if (memberASTs.length === 1 && !needsUndefined) {
    return undefined
  }

  const seen = new Set<string>()
  const members: string[] = []
  for (const memberAST of memberASTs) {
    // render via generateRawType when the AST carries the index signature's keyName,
    // which would otherwise re-apply the strictIndexSignatures suffix handled below
    const type =
      memberAST.keyName === '[k: string]' ? generateRawType(memberAST, options) : generateType(memberAST, options)
    // a named alias of a leaf type (e.g. `type Foo = string`) also covers its
    // underlying type, so dedupe against both renderings. Restricted to leaf types
    // because structurally rendering a compound type's body can re-enter an
    // in-flight render for self-referential schemas (memoization only caches
    // completed renders, so it cannot break such cycles).
    const underlying =
      hasStandaloneName(memberAST) && LEAF_TYPES.has(memberAST.type)
        ? generateRawType(omit<AST>(memberAST, 'standaloneName') as AST, options)
        : type
    if (seen.has(type) || seen.has(underlying)) {
      continue
    }
    seen.add(type)
    seen.add(underlying)
    // tsType overrides are opaque strings (e.g. function types) that may not be
    // union-safe, so parenthesize them unless they are a simple type reference
    members.push(memberAST.type === 'CUSTOM_TYPE' && !/^[\w$.]+(\[\])*$/.test(type) ? `(${type})` : type)
  }

  if (needsUndefined && !seen.has('undefined')) {
    members.push('undefined')
  }
  return members.join(' | ')
}

function generateInterface(ast: TInterface, options: Options): string {
  const params = ast.params.filter(_ => !_.isPatternProperty && !_.isUnreachableDefinition)

  const indexSignature = params.find(_ => _.isIndexSignature)
  const indexSignatureType = indexSignature
    ? generateIndexSignatureType(indexSignature, params, ast.superTypes, options)
    : undefined

  return (
    `{` +
    '\n' +
    params
      .map(param => {
        const {isRequired, isIndexSignature, keyName, ast} = param
        const type =
          param === indexSignature && indexSignatureType !== undefined ? indexSignatureType : generateType(ast, options)
        return (
          (hasComment(ast) && !ast.standaloneName ? generateComment(ast.comment, ast.deprecated) + '\n' : '') +
          (isIndexSignature ? keyName : escapeKeyName(keyName)) +
          (isRequired ? '' : '?') +
          ': ' +
          type
        )
      })
      .join('\n') +
    '\n' +
    '}'
  )
}

function generateComment(comment?: string, deprecated?: boolean): string {
  const commentLines = ['/**']
  if (deprecated) {
    commentLines.push(' * @deprecated')
  }
  if (typeof comment !== 'undefined') {
    commentLines.push(...comment.split('\n').map(_ => ' * ' + _))
  }
  commentLines.push(' */')
  return commentLines.join('\n')
}

function generateStandaloneEnum(ast: TEnum, options: Options): string {
  // Anything that is not a bare TypeScript identifier has to be quoted. Testing
  // for the valid shape (rather than for "special characters") also covers the
  // empty string and names that begin with a digit, both of which are legal
  // enum *values* but not legal identifiers.
  const isValidIdentifier = (key: string): boolean => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)

  return (
    (hasComment(ast) ? generateComment(ast.comment, ast.deprecated) + '\n' : '') +
    'export ' +
    (options.enableConstEnums ? 'const ' : '') +
    `enum ${toSafeString(ast.standaloneName)} {` +
    '\n' +
    ast.params
      .map(
        ({ast, keyName}) =>
          // JSON.stringify, not string interpolation: the key may itself contain
          // quotes or backslashes that need escaping.
          (isValidIdentifier(keyName) ? keyName : JSON.stringify(keyName)) + ' = ' + generateType(ast, options),
      )
      .join(',\n') +
    '\n' +
    '}'
  )
}

function generateStandaloneInterface(ast: TNamedInterface, options: Options): string {
  return (
    (hasComment(ast) ? generateComment(ast.comment, ast.deprecated) + '\n' : '') +
    `export interface ${toSafeString(ast.standaloneName)} ` +
    (ast.superTypes.length > 0
      ? `extends ${ast.superTypes.map(superType => toSafeString(superType.standaloneName)).join(', ')} `
      : '') +
    generateInterface(ast, options)
  )
}

function generateStandaloneType(ast: ASTWithStandaloneName, options: Options): string {
  return (
    (hasComment(ast) ? generateComment(ast.comment) + '\n' : '') +
    `export type ${toSafeString(ast.standaloneName)} = ${generateType(
      omit<AST>(ast, 'standaloneName') as AST /* TODO */,
      options,
    )}`
  )
}

function escapeKeyName(keyName: string): string {
  if (keyName.length && /[A-Za-z_$]/.test(keyName.charAt(0)) && /^[\w$]+$/.test(keyName)) {
    return keyName
  }
  return JSON.stringify(keyName)
}

function getSuperTypesAndParams(ast: TInterface): AST[] {
  return ast.params.map(param => param.ast).concat(ast.superTypes)
}
