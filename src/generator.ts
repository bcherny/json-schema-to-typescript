import {JSONSchema4Object, JSONSchema4Type} from 'json-schema'
import {isPlainObject} from 'lodash'
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
  TEnum,
  TInterface,
  TInterfaceParam,
  TIntersection,
  TNamedInterface,
  TUnion,
  T_UNDEFINED,
  T_UNKNOWN,
  T_UNKNOWN_ADDITIONAL_PROPERTIES,
} from './types/AST'
import {log, toSafeString} from './utils'

/**
 * Hooks for compiling a set of files into a set of modules (`imports` mode): the linker
 * decides which named types this file imports rather than declares, and hears about
 * every type it does declare.
 */
export interface ModuleLinker {
  /** True if `ast` is declared by another module; it is then neither declared nor descended into here */
  imports(ast: ASTWithStandaloneName): boolean
  declared?(ast: ASTWithStandaloneName): void
}

interface Scope {
  rootASTName: string
  linker?: ModuleLinker
}

/**
 * Generates the declaration file for `ast`: the banner comment, then the type aliases, the
 * interfaces and the enums, a blank line between those groups and a newline between declarations.
 * It is returned split before each top-level declaration, each part starting with the newlines
 * that separate it from the previous one; `.join('')` is the whole file.
 */
export function generate(
  ast: AST,
  options = DEFAULT_OPTIONS,
  unreachableDefinitions: AST[] = [],
  linker?: ModuleLinker,
): string[] {
  const scope: Scope = {rootASTName: ast.standaloneName!, linker}

  // One walk over the ASTs collects every standalone declaration, by kind, in the order found
  const declarations: Declarations = {enums: [], interfaces: [], types: []}
  const {enums, interfaces, types} = declarations
  const processed = new Set<AST>()
  for (const root of [ast, ...unreachableDefinitions]) {
    const enumsBefore = enums.length
    collectDeclarations(root, options, scope, processed, declarations)
    // the enums found under each root AST have always been followed by a newline of their own
    if (enums.length > enumsBefore) {
      enums[enums.length - 1] += '\n'
    }
  }

  const parts: string[] = []
  for (const group of [options.bannerComment ? [options.bannerComment] : [], types, interfaces, enums]) {
    let separator = parts.length === 0 ? '' : '\n\n'
    for (const declaration of group) {
      parts.push(separator + declaration)
      separator = '\n'
    }
  }
  parts[parts.length - 1] += '\n' // the root type is always declared, so there is a last part
  return parts
}

type Declarations = {enums: string[]; interfaces: string[]; types: string[]}

/**
 * Appends the declarations for every named type reachable from `ast` (itself included) to
 * `declarations`: enums and interfaces as such, everything else as a type alias. An array's
 * alias follows the declarations found in its items; any other declaration precedes the ones
 * found beneath it. A type another module declares (`imports` mode) is skipped, with all that
 * is beneath it.
 */
function collectDeclarations(
  ast: AST,
  options: Options,
  scope: Scope,
  processed: Set<AST>,
  declarations: Declarations,
): void {
  if (processed.has(ast) || isImported(ast, scope)) {
    return
  }
  processed.add(ast)

  switch (ast.type) {
    case 'ARRAY':
      collectDeclarations(ast.params, options, scope, processed, declarations)
      if (shouldDeclare(ast, options, scope)) {
        declarations.types.push(declared(ast, scope, generateStandaloneType(ast, options)))
      }
      return
    case 'ENUM':
      declarations.enums.push(declared(ast, scope, generateStandaloneEnum(ast, options)))
      return
    case 'INTERFACE':
      if (shouldDeclare(ast, options, scope)) {
        declarations.interfaces.push(declared(ast, scope, generateStandaloneInterface(ast, options)))
      }
      break
    default:
      if (shouldDeclare(ast, options, scope)) {
        declarations.types.push(declared(ast, scope, generateStandaloneType(ast, options)))
      }
  }
  childASTs(ast).forEach(child => collectDeclarations(child, options, scope, processed, declarations))
}

function childASTs(ast: AST): AST[] {
  switch (ast.type) {
    case 'INTERFACE':
      return ast.params.map(param => param.ast).concat(ast.superTypes)
    case 'INTERSECTION':
    case 'UNION':
      return ast.params
    case 'TUPLE':
      return ast.spreadParam ? ast.params.concat(ast.spreadParam) : ast.params
    default:
      return []
  }
}

/**
 * Should we emit a standalone declaration for this AST node? The root type is always
 * declared, as are unreachable definitions (when `unreachableDefinitions` is on). Everything
 * else is reachable via a `$ref`, so it's only declared when `declareExternallyReferenced` is on.
 */
function shouldDeclare(ast: AST, options: Options, scope: Scope): ast is ASTWithStandaloneName {
  return (
    hasStandaloneName(ast) &&
    (ast.standaloneName === scope.rootASTName ||
      options.declareExternallyReferenced ||
      ast.isUnreachableDefinition === true)
  )
}

/** A declaration on its way out: its `anchored` line breaks made plain ones, the linker (if any) told */
function declared(ast: ASTWithStandaloneName, scope: Scope, declaration: string): string {
  scope.linker?.declared?.(ast)
  return declaration.includes('\r') ? declaration.replace(/\r(?!\n)/g, '\n') : declaration
}

/** In `imports` mode: a named type that another module declares (the root type never is) */
function isImported(ast: AST, scope: Scope): boolean {
  return (
    scope.linker !== undefined &&
    hasStandaloneName(ast) &&
    ast.standaloneName !== scope.rootASTName &&
    scope.linker.imports(ast)
  )
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
    case 'ARRAY': {
      const modifier = readonlyModifier(ast.isReadOnly, options)
      const element = elementType(ast.params, options)
      // an array of a type below a comment is one too (same text), and says so to a union it joins
      const below = commentedTypes.get(ast.params)
      if (below && !modifier) {
        return commentedType(ast, {type: below.type + '[]', comment: below.comment})
      }
      return (modifier ? typed(modifier.trimEnd(), element) : element) + '[]'
    }
    case 'BOOLEAN':
      return 'boolean'
    case 'INTERFACE':
      return generateInterface(ast, options)
    case 'INTERSECTION':
      return generateSetOperation(ast, options)
    case 'LITERAL':
      return generateLiteral(ast.params)
    case 'NEVER':
      return 'never'
    case 'NUMBER':
      return 'number'
    case 'NULL':
      return 'null'
    case 'OBJECT':
      return 'object'
    case 'STRING':
      return 'string'
    case 'TUPLE':
      return (() => {
        const minItems = ast.minItems
        const modifier = readonlyModifier(ast.isReadOnly, options)

        let spreadParam = ast.spreadParam
        const astParams = [...ast.params]
        if (typeof ast.maxItems === 'number') {
          // Bounded: spell out the items `additionalItems` allows (the spread param) up to the
          // cap instead of as a rest element. Without one (`additionalItems: false`) nothing may
          // follow the tuple's own items, whatever `maxItems` says.
          if (spreadParam) {
            while (astParams.length < ast.maxItems) astParams.push(spreadParam)
            spreadParam = undefined
          }
        } else if (minItems > astParams.length && spreadParam === undefined) {
          // `additionalItems: false` with a `minItems` beyond the tuple's own items, which no
          // array satisfies: emitted as an open tuple, as it always has been, rather than `never`
          spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY
        }

        function addSpreadParam(params: string[]): string[] {
          if (spreadParam) {
            // the rest type keeps the parentheses it has always had here unless it plainly needs
            // none: a `tsType` can say anything, on its own or at the end of a `T[]`
            const rest = generateType(spreadParam, options)
            const atomic =
              TYPE_REFERENCE.test(rest) ||
              isStringLiteral(rest) ||
              (spreadParam.type === 'INTERFACE' && !bareSetOperations.has(spreadParam))
            params.push('...' + (atomic ? rest : parenthesize(rest)) + '[]')
          }
          return params
        }

        function paramsToString(params: string[]): string {
          return modifier + generateBracketed(params)
        }

        // a union on lines of its own goes in parentheses, as prettier puts it
        const paramsList = astParams.map(param => {
          const type = generateType(param, options)
          return type.includes('\n') && bareSetOperations.has(param) ? parenthesize(type) : type
        })

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

          // a bare union, like generateSetOperation's: callers that append `[]` or combine it
          // with `&` parenthesize it (`operandType`)
          bareSetOperations.add(ast)
          return generateUnion(typesToUnion.map(type => ({type})))
        }

        // no optional items, so a single tuple type
        return paramsToString(addSpreadParam(paramsList))
      })()
    case 'UNION':
      return generateSetOperation(ast, options)
    case 'UNKNOWN':
      return 'unknown'
    case 'CUSTOM_TYPE':
      // its lines stay at the columns it puts them: inside a template literal they are the type
      return ast.params.includes('\n') ? anchored(ast.params) : ast.params
  }
}

/**
 * TypeScript's `readonly` modifier, for a property or an array type: on for everything under the
 * `readonly` option, or driven by the schema's own `readOnly` annotation under `readonlyKeyword`.
 */
function readonlyModifier(isReadOnly: boolean | undefined, options: Options): string {
  return options.readonly || (options.readonlyKeyword && isReadOnly) ? 'readonly ' : ''
}

/**
 * Layout of the generated text. Prettier (`format: true`) redoes all of it; without it this is
 * what the reader gets, so nested lines are indented, members end in `;`, and a union too long
 * for a line takes a line per member. Every type is rendered as if it started in column 0 and the
 * construct that embeds it indents the lines after its first (`indentLines`), which keeps the
 * memoized renders independent of where they are used. A type that starts with a newline (a union
 * written a member per line, a member below its comment) brings its own lines and continues the
 * `key:` or `type X =` it follows without a space (`typed`).
 */
const INDENT = '  '
/** A union, intersection or tuple longer than this on one line is written a member per line */
const MAX_WIDTH = 80

/** `text` with every line after its first moved right by `indent` (`anchored` line breaks excepted) */
function indentLines(text: string, indent = INDENT): string {
  return text.replace(/\n/g, '\n' + indent)
}

/** `text` starting on a new line of its own, a level in */
function onOwnLines(text: string): string {
  return '\n' + INDENT + indentLines(text)
}

/**
 * `text` (a multi-line `tsType`) with its lines kept at the columns they have, however deep it ends
 * up: its line breaks written as `\r`, which `indentLines` leaves alone and `declared` writes back
 * as `\n` once the whole declaration is laid out
 */
function anchored(text: string): string {
  return text.replace(/\r?\n/g, '\r')
}

function fitsOnOneLine(text: string): boolean {
  return text.length <= MAX_WIDTH && !text.includes('\n')
}

function parenthesize(type: string): string {
  return '(' + type + (type.startsWith('\n') ? '\n)' : ')')
}

/** `head` (`key:`, `export type X =`) and its `type`, on the same line unless the type brings its own lines */
function typed(head: string, type: string): string {
  return head + (type.startsWith('\n') ? '' : ' ') + type
}

/**
 * Whether a `;` may follow a member's `type` on its line: not when it already ends in one, or when
 * that line could end in a comment (a `tsType` can say anything), which would swallow it or,
 * formatted, keep it as part of the comment. Errs towards no `;` (a `//` in a template literal,
 * say), which is only cosmetic.
 * Top-level declarations get no `;` at all: prettier prints its own, and one already in its input
 * makes it (3.x) rebuild the whole text once per comment to find where the statement's code ends.
 */
function mayTerminate(type: string): boolean {
  const lastLine = type.slice(type.lastIndexOf('\n') + 1)
  if (lastLine.trimEnd().endsWith(';')) {
    return false
  }
  if (!lastLine.includes('/')) {
    return true
  }
  const unquoted = lastLine.replace(/"(?:[^"\\]|\\.)*"/g, '""')
  return !unquoted.includes('//') && !unquoted.includes('*/')
}

/**
 * The nodes that rendered as a bare union or intersection (`A | B`, `A & B`), which needs
 * parentheses before `[]` is appended to it or it becomes a member of another one: recorded as
 * the text is made (generateSetOperation, the TUPLE case), so it says what the memoized text says.
 */
const bareSetOperations = new WeakSet<AST>()

/**
 * `ast`'s type where a type operator applies to it (`T[]`, `A | T`, `A & T`): parenthesized if it is
 * a bare union or intersection, or verbatim text that has to be made a single operand (see `operand`)
 */
function operandType(ast: AST, options: Options, inUnion = false): string {
  const type = generateType(ast, options)
  return bareSetOperations.has(ast) ? parenthesize(type) : operand(ast, type, inUnion)
}

/** `ast`'s type with `[]` on the way: an operand, parenthesized too where `[]` would bind to a part of it */
function elementType(ast: AST, options: Options): string {
  const type = operandType(ast, options)
  // `readonly T[][]` would make the outer array the readonly one; and a type that ends in a
  // string literal without being one (a `tsType` can say anything) keeps its parentheses
  return /^readonly\s/.test(type) || (type.endsWith('"') && !isStringLiteral(type)) ? parenthesize(type) : type
}

function isStringLiteral(type: string): boolean {
  return /^"(?:[^"\\]|\\.)*"$/.test(type)
}

/** A union or intersection member: its text and the comment that goes before it */
type Member = {type: string; comment?: string}

/** A member's text below its comment, if any, on lines of their own */
function commented({type, comment}: Member): string {
  return comment === undefined ? type : onOwnLines(comment + '\n' + type)
}

/**
 * The nodes whose text is a type below a comment (an anonymous set operation of one described
 * object, an array of one), taken apart: a union or intersection such a node joins puts the
 * comment where its members' comments go -- before the `|`, where the formatter reads it as the
 * union's when it comes first -- rather than finding it inside the member's text.
 */
const commentedTypes = new WeakMap<AST, Member>()

/** `member` as `ast`'s text (see `commented`), remembered in `commentedTypes` if it has a comment */
function commentedType(ast: AST, member: Member): string {
  if (member.comment !== undefined) {
    commentedTypes.set(ast, member)
  }
  return commented(member)
}

/**
 * `A | B | C` — or, when that does not fit on a line or a member carries a comment, a line per
 * member, each behind a `|` of its own and below its comment, indented a level since it
 * continues a `type X =` or `key:` line:
 *
 *     | A
 *     /** comment * /
 *     | {
 *         b: string;
 *       }
 */
function generateUnion(members: Member[]): string {
  const line = members.map(_ => _.type).join(' | ')
  if (fitsOnOneLine(line) && members.every(_ => _.comment === undefined)) {
    return line
  }
  return members
    .map(
      ({type, comment}) =>
        (comment === undefined ? '' : onOwnLines(comment)) +
        ('\n' + INDENT + (type.startsWith('\n') ? '|' : '| ') + indentLines(type, INDENT + INDENT)),
    )
    .join('')
}

/**
 * `A & B & {...}`, a line per member (`&` last) when that does not fit on a line and no member
 * spans lines anyway; a commented member goes on the lines after its `&`, below its comment
 */
function generateIntersection(members: Member[]): string {
  const operands = members.map(commented)
  const wrap = operands.every(_ => !_.includes('\n')) && !fitsOnOneLine(operands.join(' & '))
  return operands.reduce(
    (text, operand) => text + (operand.startsWith('\n') ? ' &' : wrap ? ' &\n' + INDENT : ' & ') + operand,
  )
}

/** `[A, B]`, an element per line when that does not fit on one */
function generateBracketed(elements: string[]): string {
  const line = '[' + elements.join(', ') + ']'
  if (fitsOnOneLine(line)) {
    return line
  }
  // (an element that brings its own lines -- a member below its comment -- starts on a new one already)
  return '[\n' + elements.map(_ => (_.startsWith('\n') ? _.slice(1) : INDENT + indentLines(_))).join(',\n') + '\n]'
}

/**
 * A JSON value (of a `const`, or an `enum` member) as the type of exactly that value: what
 * `JSON.stringify` prints, written as TypeScript writes object types — keys quoted only where they
 * have to be, `;` between members — except for an empty object anywhere in it. The type `{}` admits
 * any non-nullish value, not just the empty object, so that is spelled as the closed empty object.
 * Kept on one line: prettier keeps an object type on one line or not depending on how it got it.
 */
function generateLiteral(value: JSONSchema4Type): string {
  if (Array.isArray(value)) {
    return '[' + value.map(_ => generateLiteral(_ ?? null)).join(', ') + ']'
  }
  if (isPlainObject(value)) {
    const members = Object.entries(value as JSONSchema4Object)
      .filter(([, _]) => JSON.stringify(_) !== undefined)
      .map(([key, _]) => escapeKeyName(key) + ': ' + generateLiteral(_))
    return members.length ? '{' + members.join('; ') + '}' : '{[k: string]: never}'
  }
  return JSON.stringify(value)
}

/**
 * Generate a Union or Intersection
 */
function generateSetOperation(ast: TIntersection | TUnion, options: Options): string {
  if (ast.params.length === 0) {
    // A union of nothing accepts nothing (`never`). An intersection of nothing (eg. every
    // `allOf` member turned out to contribute no information) constrains nothing -- render it
    // exactly like the `{[k: string]: unknown}` a single vacuous member would otherwise have
    // produced, so it still dedupes against an identical sibling rather than showing up as a
    // spurious, differently-spelled extra member.
    return ast.type === 'UNION' ? 'never' : generateInterface(vacuousInterface(options), options)
  }
  if (ast.params.length === 1) {
    // rendered as its member, below the member's comment
    const param = setOperationMember(ast.params[0])
    if (bareSetOperations.has(param)) {
      bareSetOperations.add(ast)
    }
    const member = commentedTypes.get(param) ?? {
      type: operand(param, generateType(param, options)),
      comment: memberComment(param),
    }
    return commentedType(ast, member)
  }
  const members = ast.params.map(_ => memberOf(_, options, ast.type === 'UNION'))
  bareSetOperations.add(ast)
  return ast.type === 'UNION' ? generateUnion(members) : generateIntersection(members)
}

/**
 * `ast` as a member of a union (`inUnion`) or intersection: the text of the member it stands for
 * (see `setOperationMember`) made a single operand, and that member's comment. A verbatim bare
 * union of names joins a union `ast` itself is a member of as it is (see `operand`).
 */
function memberOf(ast: AST, options: Options, inUnion: boolean): Member {
  const member = setOperationMember(ast)
  return (
    commentedTypes.get(member) ?? {
      type: operandType(member, options, inUnion && member === ast),
      comment: memberComment(member),
    }
  )
}

/**
 * What a set operation renders for `ast` as one of its members: an anonymous one-member set
 * operation (a lone `oneOf` branch, say) renders as its member, so it is that member — whose
 * comment then goes where the enclosing operation puts member comments, not inside its text.
 */
function setOperationMember(ast: AST): AST {
  while ((ast.type === 'UNION' || ast.type === 'INTERSECTION') && ast.params.length === 1 && !hasStandaloneName(ast)) {
    ast = ast.params[0]
  }
  return ast
}

/**
 * The comment of an anonymous object-literal member (eg. a `oneOf`/`anyOf` branch with its own
 * `description` but no name of its own), which would otherwise be silently dropped: a named
 * member's comment is printed on its own declaration (see generateStandaloneInterface), and
 * non-object members (string, number, ...) have no declaration site for a leading comment to
 * meaningfully attach to, so only INTERFACE members are handled here. It goes on lines of its own
 * before the member (see generateUnion and generateIntersection), which keeps the formatter from
 * attaching it to the end of the previous member (`} /** ... * / | {`).
 */
function memberComment(ast: AST): string | undefined {
  return ast.type === 'INTERFACE' && hasComment(ast) && !hasStandaloneName(ast)
    ? generateComment(ast.comment, ast.deprecated)
    : undefined
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
 * A `tsType` (or `formatTypes`) override is an opaque string. Where the generator composes it into a
 * larger type -- an array's element, a member of a union or intersection -- it binds as written only
 * if it is a single operand (`() => void[]` is a function returning an array; `keyof Foo[]` is the
 * keys of an array), so anything but a plain type reference is parenthesized; the formatter drops
 * the pair again where it was not needed. A bare union of names needs none inside a union.
 */
function operand(ast: AST, type: string, inUnion = false): string {
  if (ast.type !== 'CUSTOM_TYPE' || TYPE_REFERENCE.test(type)) {
    return type
  }
  if (inUnion && customUnionMembers(type)) {
    return type
  }
  // a `//` comment on its last line would swallow the closing parenthesis
  return /\/\/[^\n\r]*$/.test(type) ? `(${type}\n)` : `(${type})`
}
const TYPE_REFERENCE = /^[\w$.]+(<[^<>]*>)?(\[\])*$/

/**
 * The members of a verbatim type that is provably a bare union of names (`A | B`, `keyof A | null`:
 * nothing but identifier characters, whitespace and `|` -- no brackets, quotes, arrows or anything
 * else that would take real parsing), which can join an enclosing union as they are
 */
function customUnionMembers(type: string): string[] | undefined {
  return /^[\w$.\s|]+$/.test(type)
    ? type
        .split('|')
        .map(_ => _.trim())
        .filter(Boolean)
    : undefined
}

/**
 * `T | undefined`, for an optional property under `undefinedOptionalProperties`. An
 * anonymous union takes `undefined` as one more member rather than nesting
 * (`string | number | undefined`, not `(string | number) | undefined`); `any`,
 * `unknown` and a `tsType` union that lists `undefined` itself already include it.
 */
function orUndefined(ast: AST, type: string, options: Options): string {
  if (isAny(ast) || isUnknown(ast)) {
    return type
  }
  if (ast.type === 'CUSTOM_TYPE' && customUnionMembers(type)?.includes('undefined')) {
    return type
  }
  if (ast.type === 'UNION' && !hasStandaloneName(ast)) {
    return generateType({...ast, params: [...ast.params, T_UNDEFINED]}, options)
  }
  // (`type` is `ast`'s memoized rendering)
  return operandType(ast, options, true) + ' | undefined'
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
    // also flatten anonymous tsType unions, when provably safe to split
    const members = ast.type === 'CUSTOM_TYPE' && !hasStandaloneName(ast) ? customUnionMembers(ast.params) : undefined
    if (members) {
      members.forEach(params => memberASTs.push({type: 'CUSTOM_TYPE', params}))
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
  const members: Member[] = []
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
    // a described object's comment has never been printed here; one a member renders below (an
    // anonymous set operation of one, an array of one) goes where the union puts member comments
    members.push(
      memberAST.type === 'INTERFACE' ? {type: generateType(memberAST, options)} : memberOf(memberAST, options, true),
    )
  }

  if (needsUndefined && !seen.has('undefined')) {
    members.push({type: 'undefined'})
  }
  return generateUnion(members)
}

function generateInterface(ast: TInterface, options: Options): string {
  const params = ast.params.filter(_ => !_.isPatternProperty && !_.isUnreachableDefinition)
  if (params.length === 0) {
    return '{}'
  }

  const indexSignature = params.find(_ => _.isIndexSignature)
  const indexSignatureType = indexSignature
    ? generateIndexSignatureType(indexSignature, params, ast.superTypes, options)
    : undefined

  const members = params.map(param => {
    const {isRequired, isIndexSignature, keyName, ast} = param
    // the widened type handles strictIndexSignatures itself; the fallback path
    // (widening skipped or unneeded) appends `| undefined` here
    let type =
      param === indexSignature && indexSignatureType !== undefined
        ? indexSignatureType
        : generateType(ast, options) + (isIndexSignature && options.strictIndexSignatures ? ' | undefined' : '')
    if (!isRequired && !isIndexSignature && options.undefinedOptionalProperties) {
      type = orUndefined(ast, type, options)
    }
    const commented = withItemsComment(ast)
    const member =
      (hasComment(commented) && !ast.standaloneName
        ? generateComment(commented.comment, commented.deprecated) + '\n'
        : '') +
      readonlyModifier(param.isReadOnly, options) +
      (isIndexSignature ? keyName : escapeKeyName(keyName)) +
      (isRequired ? '' : '?') +
      ':'
    return INDENT + indentLines(typed(member, type) + (mayTerminate(type) ? ';' : ''))
  })
  return '{\n' + members.join('\n') + '\n}'
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
    // a line break is a line break however the schema's author's editor wrote it
    commentLines.push(...comment.split(/\r\n|\r|\n/).map(_ => (_ === '' ? ' *' : ' * ' + _)))
  }
  commentLines.push(' */')
  return commentLines.join('\n')
}

function generateStandaloneEnum(ast: TEnum, options: Options): string {
  return (
    (hasComment(ast) ? generateComment(ast.comment, ast.deprecated) + '\n' : '') +
    'export ' +
    (options.enableConstEnums ? 'const ' : '') +
    `enum ${toSafeString(ast.standaloneName)} {` +
    '\n' +
    ast.params
      .map(
        ({ast, keyName}) =>
          // The initializer is a value, not a type, so a literal is printed verbatim (an object
          // member is not valid TypeScript either way, but it must not come out in
          // `generateLiteral`'s type notation).
          INDENT +
          escapeKeyName(keyName) +
          ' = ' +
          (ast.type === 'LITERAL' ? JSON.stringify(ast.params) : indentLines(generateType(ast, options))),
      )
      .join(',\n') +
    '\n' +
    '}'
  )
}

function generateStandaloneInterface(ast: TNamedInterface, options: Options): string {
  const name = toSafeString(ast.standaloneName)
  const body = generateInterface(ast, options)
  const comment = hasComment(ast) ? generateComment(ast.comment, ast.deprecated) + '\n' : ''
  // `extends` means an instance also validates against each base schema: an intersection. It is
  // printed as an `interface … extends` clause when every base is something an interface may
  // extend, and as the intersection itself otherwise (or when type aliases were asked for)
  if (options.declarationStyle === 'type' || !ast.superTypes.every(_ => isExtendable(_))) {
    const members = [...ast.superTypes, ast].map((_): Member => {
      const type = _ === ast ? body : generateType(_, options)
      return {type: bareSetOperations.has(_) ? parenthesize(type) : type}
    })
    return comment + `export type ${name} = ${generateIntersection(members)}`
  }
  const superTypes = ast.superTypes.map(superType => toSafeString(superType.standaloneName))
  return comment + `export interface ${name} ${superTypes.length > 0 ? `extends ${superTypes.join(', ')} ` : ''}${body}`
}

/**
 * A base an `interface` declaration may name in its `extends` clause: a named object type
 * (not `unknown`, a primitive, or a union: TS2312), not the closed empty object, whose
 * `never` index signature would reject every property the extending interface declares
 * (TS2411), and itself printed as an interface, i.e. its own bases pass the same test (`seen`
 * guards `extends` cycles). The parser casts `extends` schemas to TNamedInterface unchecked,
 * hence the checks.
 */
function isExtendable(superType: AST, seen = new Set<AST>()): boolean {
  if (seen.has(superType)) {
    return true
  }
  seen.add(superType)
  return (
    superType.type === 'INTERFACE' &&
    hasStandaloneName(superType) &&
    !(
      superType.params.length === 1 &&
      superType.params[0].isIndexSignature &&
      superType.params[0].ast.type === 'NEVER'
    ) &&
    superType.superTypes.every(_ => isExtendable(_, seen))
  )
}

function generateStandaloneType(ast: ASTWithStandaloneName, options: Options): string {
  const commented = withItemsComment(ast)
  return (
    (hasComment(commented) ? generateComment(commented.comment) + '\n' : '') +
    typed(`export type ${toSafeString(ast.standaloneName)} =`, generateType(omitStandaloneName(ast), options))
  )
}

/** A property key or enum member name as written in a type: bare if it is an identifier, else quoted (and escaped) */
function escapeKeyName(keyName: string): string {
  if (keyName.length && /[A-Za-z_$]/.test(keyName.charAt(0)) && /^[\w$]+$/.test(keyName)) {
    return keyName
  }
  return JSON.stringify(keyName)
}
