import {omit} from 'lodash'
import {memoize} from './memoize'
import {DEFAULT_OPTIONS, Options} from './index'
import {
  AST,
  ASTWithStandaloneName,
  hasComment,
  hasStandaloneName,
  omitStandaloneName,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
  TArray,
  TEnum,
  TInterface,
  TInterfaceParam,
  TIntersection,
  TNamedInterface,
  TUnion,
  T_UNKNOWN,
  T_UNKNOWN_ADDITIONAL_PROPERTIES,
} from './types/AST'
import {log, toSafeString} from './utils'

export function generate(ast: AST, options = DEFAULT_OPTIONS, unreachableDefinitions: AST[] = []): string {
  const rootASTName = ast.standaloneName!
  const asts = [ast, ...unreachableDefinitions]
  const typesProcessed = new Set<AST>()
  const interfacesProcessed = new Set<AST>()
  const enumsProcessed = new Set<AST>()
  return (
    [
      options.bannerComment,
      asts
        .map(_ => declareNamedTypes(_, options, rootASTName, typesProcessed))
        .filter(Boolean)
        .join('\n'),
      asts
        .map(_ => declareNamedInterfaces(_, options, rootASTName, interfacesProcessed))
        .filter(Boolean)
        .join('\n'),
      asts
        .map(_ => declareEnums(_, options, enumsProcessed))
        .filter(Boolean)
        .join('\n'),
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

/**
 * Should we emit a standalone declaration for this AST node? The root type is always
 * declared, as are unreachable definitions (when `unreachableDefinitions` is on). Everything
 * else is reachable via a `$ref`, so it's only declared when `declareExternallyReferenced` is on.
 */
function shouldDeclare(ast: AST, options: Options, rootASTName: string): ast is ASTWithStandaloneName {
  return (
    hasStandaloneName(ast) &&
    (ast.standaloneName === rootASTName || options.declareExternallyReferenced || ast.isUnreachableDefinition === true)
  )
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
        shouldDeclare(ast, options, rootASTName) && generateStandaloneInterface(ast, options),
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
        shouldDeclare(ast, options, rootASTName) ? generateStandaloneType(ast, options) : undefined,
      ]
        .filter(Boolean)
        .join('\n')
    case 'ENUM':
      return ''
    case 'INTERFACE':
      return getSuperTypesAndParams(ast)
        .map(ast => declareNamedTypes(ast, options, rootASTName, processed))
        .filter(Boolean)
        .join('\n')
    case 'INTERSECTION':
    case 'TUPLE':
    case 'UNION':
      return [
        shouldDeclare(ast, options, rootASTName) ? generateStandaloneType(ast, options) : undefined,
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
      if (shouldDeclare(ast, options, rootASTName)) {
        return generateStandaloneType(ast, options)
      }
      return ''
  }
}

export const generateType = memoize(generateRawType)

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
        // `readonly T[][]` would make the outer array the readonly one
        const element = type.endsWith('"') || type.startsWith('readonly ') ? '(' + type + ')' : type
        return readonlyModifier(ast.isReadOnly, options) + element + '[]'
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
        const modifier = readonlyModifier(ast.isReadOnly, options)

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
          return modifier + '[' + params.join(', ') + ']'
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

          // Parenthesize the union (like generateSetOperation does) so callers can
          // safely append `[]` or combine it with `&`.
          return '(' + typesToUnion.join(' | ') + ')'
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
 * TypeScript's `readonly` modifier, for a property or an array type: on for everything under the
 * `readonly` option, otherwise driven by the schema's own `readOnly` annotation.
 */
function readonlyModifier(isReadOnly: boolean | undefined, options: Options): string {
  return options.readonly || (options.readonlyKeyword && isReadOnly) ? 'readonly ' : ''
}

/**
 * Generate a Union or Intersection
 */
function generateSetOperation(ast: TIntersection | TUnion, options: Options): string {
  const members = (ast as TUnion).params.map(_ => {
    const type = generateType(_, options)
    // An anonymous object-literal member (eg. an `oneOf`/`anyOf` branch with its
    // own `description` but no name of its own) would otherwise have its comment
    // silently dropped: a named member's comment is printed on its own
    // declaration (see generateStandaloneInterface), and non-object members
    // (string, number, ...) have no declaration site for a leading comment to
    // meaningfully attach to, so only INTERFACE members are handled here. The
    // leading newline keeps the formatter from attaching the comment to the end
    // of the previous member (`} /** ... */ | {`).
    return _.type === 'INTERFACE' && hasComment(_) && !hasStandaloneName(_)
      ? '\n' + generateComment(_.comment, _.deprecated) + '\n' + type
      : type
  })
  const separator = ast.type === 'UNION' ? '|' : '&'
  if (members.length === 0) {
    // A union of nothing accepts nothing (`never`). An intersection of nothing (eg. every
    // `allOf` member turned out to contribute no information) constrains nothing -- render it
    // exactly like the `{[k: string]: unknown}` a single vacuous member would otherwise have
    // produced, so it still dedupes against an identical sibling rather than showing up as a
    // spurious, differently-spelled extra member.
    return ast.type === 'UNION' ? 'never' : generateInterface(vacuousInterface(options), options)
  }
  return members.length === 1 ? members[0] : '(' + members.join(' ' + separator + ' ') + ')'
}

function vacuousInterface(options: Options): TInterface {
  return {
    params: [
      {
        ast: options.unknownAny ? T_UNKNOWN_ADDITIONAL_PROPERTIES : T_ANY_ADDITIONAL_PROPERTIES,
        isIndexSignature: true,
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: '[k: string]',
      },
    ],
    superTypes: [],
    type: 'INTERFACE',
  }
}

// `any`/`unknown` accept every other type, making index-signature widening
// unnecessary. Checked on the AST (which covers named aliases, since the name is
// metadata on the same node); `tsType` overrides are compared textually since they
// are opaque.
function isAny(ast: AST): boolean {
  return ast.type === 'ANY' || (ast.type === 'CUSTOM_TYPE' && ast.params.trim() === 'any')
}
function isUnknown(ast: AST): boolean {
  return ast.type === 'UNKNOWN' || (ast.type === 'CUSTOM_TYPE' && ast.params.trim() === 'unknown')
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
      // the parser casts `extends` schemas to TNamedInterface unchecked, so a
      // non-object supertype has no params to collect
      if (superType.type !== 'INTERFACE') {
        continue
      }
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
 *
 * Known limitation: when a supertype declares its own index signature, widening the
 * subtype's can make the two incompatible (TS2430) — that case needs narrowing, not
 * widening, and is out of scope here.
 */
function generateIndexSignatureType(
  indexSignature: TInterfaceParam,
  params: TInterfaceParam[],
  superTypes: TNamedInterface[],
  options: Options,
): string | undefined {
  if (isAny(indexSignature.ast) || isUnknown(indexSignature.ast)) {
    return undefined
  }

  const memberASTs: AST[] = []
  function addMember(ast: AST): void {
    // flatten anonymous unions so their members participate in deduplication
    if (ast.type === 'UNION' && !hasStandaloneName(ast)) {
      ast.params.forEach(addMember)
      return
    }
    // also flatten anonymous tsType unions, but only when provably safe to split:
    // nothing but identifier characters, whitespace, and `|` (no brackets, quotes,
    // arrows, or other constructs that would require real parsing)
    if (
      ast.type === 'CUSTOM_TYPE' &&
      !hasStandaloneName(ast) &&
      ast.params.includes('|') &&
      /^[\w$.\s|]+$/.test(ast.params)
    ) {
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
    if (isAny(sibling.ast)) {
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

  // `unknown` absorbs every other member; so does an `any` among the index
  // signature's own members that the optimizer did not already collapse (a
  // `tsType: 'any'` patternProperty, say)
  const top = memberASTs.some(isAny) ? 'any' : memberASTs.some(isUnknown) ? 'unknown' : undefined
  if (top) {
    return options.strictIndexSignatures ? `${top} | undefined` : top
  }

  // degenerate index signature type (e.g. an empty anyOf): render it as-is
  if (memberASTs.length === 0) {
    return undefined
  }

  // nothing to widen: keep the memoized as-is rendering
  if (memberASTs.length === 1 && !needsUndefined) {
    return undefined
  }

  const seen = new Set<string>()
  const members: string[] = []
  for (const memberAST of memberASTs) {
    const type = generateType(memberAST, options)
    // a named alias of a leaf type (e.g. `type Foo = string`) also covers its
    // underlying type, so dedupe against both renderings. Restricted to leaf types
    // because structurally rendering a compound type's body can re-enter an
    // in-flight render for self-referential schemas (memoization only caches
    // completed renders, so it cannot break such cycles). (generateRawType, not
    // generateType: the name-stripped copy is a fresh object, so memoization
    // can't help anyway.)
    const underlying =
      hasStandaloneName(memberAST) && LEAF_TYPES.has(memberAST.type)
        ? generateRawType(omitStandaloneName(memberAST), options)
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
        // the widened type handles strictIndexSignatures itself; the fallback path
        // (widening skipped or unneeded) appends `| undefined` here
        const type =
          param === indexSignature && indexSignatureType !== undefined
            ? indexSignatureType
            : generateType(ast, options) + (isIndexSignature && options.strictIndexSignatures ? ' | undefined' : '')
        const commented = withItemsComment(ast)
        return (
          (hasComment(commented) && !ast.standaloneName
            ? generateComment(commented.comment, commented.deprecated) + '\n'
            : '') +
          readonlyModifier(param.isReadOnly, options) +
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

/**
 * An inline (non-standalone) item schema is rendered mid-expression (`T[]`,
 * `[T, ...T[]]`), where no statement line can carry a JSDoc block of its own, so
 * its description is surfaced in the comment of the declaration the array type is
 * attached to - a standalone type alias or an interface property - under an
 * "Items:" label. This is the one place that decides where item descriptions go
 * (#660).
 */
function withItemsComment<A extends AST>(ast: A): A {
  const itemsComment = getItemsComment(ast)
  if (itemsComment === undefined) {
    return ast
  }
  return {...ast, comment: ast.comment ? ast.comment + '\n\n' + itemsComment : itemsComment}
}

function getItemsComment(ast: AST): string | undefined {
  let members: AST[]
  switch (ast.type) {
    case 'ARRAY':
      members = [ast.params]
      break
    case 'TUPLE':
      members = ast.spreadParam ? [...ast.params, ast.spreadParam] : ast.params
      break
    default:
      return undefined
  }
  // Named item types are declared separately with their own comment. Nested array
  // types are skipped too: the normalizer appends `@minItems`/`@maxItems` block
  // tags to their descriptions, which would read as tags of this declaration.
  const comments = new Set(
    members.map(_ => (hasStandaloneName(_) || _.type === 'ARRAY' || _.type === 'TUPLE' ? undefined : _.comment)),
  )
  // Every member has to carry the same description (for a tuple: one `items` schema
  // that minItems/maxItems expanded). Distinct positional descriptions have no
  // agreed rendering and are left out, as before.
  const [comment] = comments
  // TypeScript reads a JSDoc block tag (`@word` at line start or after whitespace)
  // anywhere in a comment as a tag of the declaration the comment sits on, so a
  // tagged item description (e.g. `@deprecated`) is not hoisted onto the array.
  if (comments.size !== 1 || !comment || /(^|\s)@\w/.test(comment)) {
    return undefined
  }
  return 'Items: ' + comment
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
  const commented = withItemsComment(ast)
  return (
    (hasComment(commented) ? generateComment(commented.comment) + '\n' : '') +
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
