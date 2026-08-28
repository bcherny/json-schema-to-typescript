import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {includes, isPlainObject, map, omit} from 'lodash'
import {format} from 'util'
import {Options} from './'
import {applySchemaTyping} from './applySchemaTyping'
import type {AST, TInterface, TInterfaceParam, TIntersection, TNamedInterface, TTuple} from './types/AST'
import {
  hasStandaloneName,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
  T_NEVER_ADDITIONAL_PROPERTIES,
  T_UNKNOWN,
  T_UNKNOWN_ADDITIONAL_PROPERTIES,
} from './types/AST'
import type {
  EnumJSONSchema,
  JSONSchemaWithDefinitions,
  LinkedJSONSchema,
  NormalizedJSONSchema,
  SchemaSchema,
  SchemaType,
} from './types/JSONSchema'
import {Intersection, Parent, Shared, Types, getRootSchema, isBoolean, isPrimitive} from './types/JSONSchema'
import {memoize} from './memoize'
import {ANNOTATION_KEYWORDS, TYPE_SHAPING_KEYWORDS} from './keywords'
import {DereferencedPaths} from './resolver'
import {generateName, justName, log, maybeStripDefault} from './utils'

export type Processed = Map<NormalizedJSONSchema, Map<SchemaType, AST>>

export type UsedNames = Set<string>

export function parse(
  schema: NormalizedJSONSchema | JSONSchema4Type,
  options: Options,
  keyName?: string,
  processed: Processed = new Map(),
  usedNames = new Set<string>(),
): AST {
  if (isPrimitive(schema)) {
    if (isBoolean(schema)) {
      return parseBooleanSchema(schema, keyName, options)
    }

    return parseLiteral(schema, keyName)
  }

  const intersection = schema[Intersection]
  const types = schema[Types]

  if (intersection) {
    // Re-entered while this schema's intersection is still being parsed (eg. a
    // picked property's type leads back here): return the placeholder, which
    // parseAsTypeWithCache fills in place once the outer call finishes.
    const inProgress = processed.get(intersection)?.get('ALL_OF')
    if (inProgress && !inProgress.type) {
      return inProgress
    }
    const ast = parseAsTypeWithCache(intersection, 'ALL_OF', options, keyName, processed, usedNames) as TIntersection

    // A cyclic schema can re-enter `parse` for this same intersection while the call
    // above us is still building it. In that case we get back the empty placeholder
    // that `parseAsTypeWithCache` caches to break cycles, and `params` doesn't exist
    // yet. That call fills it in -- with these very same types -- once it unwinds, and
    // it fills in this exact object, so returning the reference as-is is correct.
    if (ast.params === undefined) {
      return ast
    }

    types.forEach(type => {
      ast.params.push(parseAsTypeWithCache(schema, type, options, keyName, processed, usedNames))
    })

    log('blue', 'parser', 'Types:', [...types], 'Input:', schema, 'Output:', ast)
    return ast
  }

  if (types.size === 1) {
    const type = [...types][0]
    const ast = parseAsTypeWithCache(schema, type, options, keyName, processed, usedNames)
    log('blue', 'parser', 'Type:', type, 'Input:', schema, 'Output:', ast)
    return ast
  }

  throw new ReferenceError('Expected intersection schema. Please file an issue on GitHub.')
}

/**
 * A schema that refers back to itself can only be emitted as a named declaration:
 * an anonymous type has no way to mention itself, so the generator would try to
 * inline it forever. Recursive schemas usually have a name by the time they get
 * here (a `title`, an `$id`, a key in `definitions`), but not always -- eg. a
 * self-referencing `oneOf` that lives outside of `definitions`, or the copy the
 * resolver makes of a definition wherever a `$ref` to it carries sibling keywords.
 *
 * Guarantees that every reference cycle in the AST passes through a named type, by
 * naming anonymous types where it has to: after the `$ref` they were dereferenced
 * from when there is one, else after the closest property key or `$ref` above them.
 */
export function nameAnonymousRecursiveTypes(
  asts: AST[],
  processed: Processed,
  dereferencedPaths: DereferencedPaths,
  usedNames: UsedNames,
): void {
  const refNames = new Map<AST, string>()
  processed.forEach((asts, schema) => {
    const name = justName(dereferencedPaths.get(schema))
    if (name) {
      asts.forEach(_ => refNames.set(_, name))
    }
  })

  // The generator emits a named type by reference (and declares it separately), and
  // inlines everything else -- so it recurses forever exactly when some cycle is made
  // of anonymous types only. Walk the AST the same way: a named type ends the current
  // path and becomes a root of its own, so an edge that leads back into the current
  // path (past its root) closes an all-anonymous cycle. Name one of that edge's two
  // ends; every cycle through the edge contains both. A type named part-way through a
  // walk can hide a second cycle that shares its path but not that type, so walk
  // again until a walk finds nothing to name (one extra walk, in practice).
  let named: boolean
  do {
    named = false
    const done = new Set<AST>()
    const roots = [...asts]
    const path: AST[] = []
    const visit = (node: AST): void => {
      if (done.has(node)) {
        return
      }
      if (path.length && hasStandaloneName(node)) {
        roots.push(node)
        return
      }
      const index = path.indexOf(node)
      if (index > -1) {
        if (!path.slice(index).some(hasStandaloneName)) {
          const target = pickEnd(node, path[path.length - 1])
          target.standaloneName = generateName(refNames.get(target) ?? keyOf(target) ?? closestName(path), usedNames)
          named = true
        }
        return
      }
      path.push(node)
      subtrees(node).forEach(visit)
      path.pop()
      done.add(node)
    }
    while (roots.length) {
      visit(roots.pop()!)
    }
  } while (named)

  // Prefer the end that was reached through a `$ref` (the resolver's copies share
  // their children with the original, so a cycle through a copy is often entered at
  // a child rather than at the copy), then the end that isn't a list, so that the
  // alias reads `type Foo = string | Foo[]` rather than naming the array.
  function pickEnd(node: AST, source: AST): AST {
    if (refNames.has(node) !== refNames.has(source)) {
      return refNames.has(node) ? node : source
    }
    return isList(node) && !isList(source) ? source : node
  }

  // Last resort is the root the walk started from: the schema itself or a named type
  function closestName(path: AST[]): string {
    const above = [...path].reverse()
    return above.map(_ => refNames.get(_)).find(Boolean) ?? above.map(keyOf).find(Boolean) ?? path[0].standaloneName!
  }
}

/** A node's property key -- ignoring the placeholder that array items get */
function keyOf(ast: AST): string | undefined {
  return ast.keyName?.includes('{keyNameFromDefinition}') ? undefined : ast.keyName
}

function isList(ast: AST): boolean {
  return ast.type === 'ARRAY' || ast.type === 'TUPLE'
}

function subtrees(ast: AST): AST[] {
  switch (ast.type) {
    case 'ARRAY':
      return [ast.params]
    case 'INTERFACE':
      return ast.params.map(_ => _.ast).concat(ast.superTypes)
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
 * Parses the root schema's definitions so that they get declared even though nothing
 * refers to them (the `unreachableDefinitions` option). An object schema declares its
 * own definitions, nested `definitions` blocks included, when its interface is parsed
 * (see `parseSchema`); this covers every other kind of root -- a primitive, an array,
 * a union, an enum, a bare `$ref` -- whose definitions were otherwise dropped. Call it
 * once, on the root schema, after `parse`.
 */
export function parseUnreachableDefinitions(
  rootSchema: NormalizedJSONSchema,
  rootASTName: string,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): AST[] {
  if (!options.unreachableDefinitions || declaresInterface(rootSchema)) {
    return []
  }

  return map(rootSchema.$defs, (value, key: string) =>
    parseUnreachableDefinition(value, key, rootASTName, options, processed, usedNames),
  )
}

function parseUnreachableDefinition(
  schema: NormalizedJSONSchema,
  key: string,
  parentSchemaName: string,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): AST {
  const ast = parse(schema, options, key, processed, usedNames)
  const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema
via the \`definition\` "${key}".`
  ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
  ast.isUnreachableDefinition = true
  return ast
}

/** Whether `parse` renders this schema through `parseSchema` (which declares its definitions) */
function declaresInterface(schema: NormalizedJSONSchema): boolean {
  const types = schema[Types]
  return types.has('NAMED_SCHEMA') || types.has('UNNAMED_SCHEMA')
}

function parseAsTypeWithCache(
  schema: NormalizedJSONSchema,
  type: SchemaType,
  options: Options,
  keyName?: string,
  processed: Processed = new Map(),
  usedNames = new Set<string>(),
): AST {
  // If we've seen this node before, return it.
  let cachedTypeMap = processed.get(schema)
  if (!cachedTypeMap) {
    cachedTypeMap = new Map()
    processed.set(schema, cachedTypeMap)
  }
  const cachedAST = cachedTypeMap.get(type)
  if (cachedAST) {
    return cachedAST
  }

  // Cache processed ASTs before they are actually computed, then update
  // them in place using set(). This is to avoid cycles.
  // TODO: Investigate alternative approaches (lazy-computing nodes, etc.)
  const ast = {} as AST
  cachedTypeMap.set(type, ast)

  // Update the AST in place. This updates the `processed` cache, as well
  // as any nodes that directly reference the node.
  return Object.assign(ast, parseNonLiteral(schema, type, options, keyName, processed, usedNames))
}

function parseBooleanSchema(schema: boolean, keyName: string | undefined, options: Options): AST {
  if (schema) {
    return {
      keyName,
      type: options.unknownAny ? 'UNKNOWN' : 'ANY',
    }
  }

  return {
    keyName,
    type: 'NEVER',
  }
}

function parseLiteral(schema: JSONSchema4Type, keyName: string | undefined): AST {
  return {
    keyName,
    params: schema,
    type: 'LITERAL',
  }
}

function parseNonLiteral(
  schema: NormalizedJSONSchema,
  type: SchemaType,
  options: Options,
  keyName: string | undefined,
  processed: Processed,
  usedNames: UsedNames,
): AST {
  const keyNameFromDefinition = definitionKeyOf(schema)

  switch (type) {
    case 'ALL_OF':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        // An `allOf` member made up entirely of keywords this tool doesn't implement (eg.
        // `if`/`then`/`else`, `not`) doesn't match any of the type matchers in `typesOfSchema`,
        // so it falls back to `newInterface`, which synthesizes a bare `{[k: string]: unknown}`
        // for it. Intersecting with that contributes no information, so drop it rather than
        // cluttering the output. Restricted to members with no keyword this tool does recognize,
        // so it never touches a member whose emptiness is due to its *own* type (eg. a bare
        // `{type: 'object'}`, or `{required: [...]}` with no matching `properties`) -- those stay
        // exactly as before.
        params: schema
          .allOf!.map(memberSchema => ({
            ast: parseMember(memberSchema, schema, options, processed, usedNames),
            memberSchema,
          }))
          .filter(({ast, memberSchema}) => !(hasNoRecognizedKeywords(memberSchema) && isVacuousInterface(ast)))
          .map(({ast}) => ast)
          .concat(parseRequired(schema, options, processed, usedNames)),
        type: 'INTERSECTION',
      }
    case 'ANY':
      return {
        ...(options.unknownAny ? T_UNKNOWN : T_ANY),
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
      }
    case 'ANY_OF':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        params: parseBranches(schema.anyOf!, schema, options, processed, usedNames),
        type: 'UNION',
      }
    case 'BOOLEAN':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'BOOLEAN',
      }
    case 'CUSTOM_TYPE':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        params: schema.tsType!,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'CUSTOM_TYPE',
      }
    case 'NAMED_ENUM': {
      const enumName = standaloneName(schema, keyNameFromDefinition ?? keyName, usedNames, options)
      // A TypeScript enum declaration requires a name. In positions that supply
      // none (an `anyOf`/`oneOf` branch, say) fall back to a union of literals
      // rather than emitting a nameless `export enum { ... }`, which is invalid.
      if (!enumName) {
        return {
          comment: schema.description,
          deprecated: schema.deprecated,
          keyName,
          params: (schema as EnumJSONSchema).enum!.map(_ => parseLiteral(_, undefined)),
          type: 'UNION',
        }
      }
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: enumName,
        params: (schema as EnumJSONSchema).enum!.map((_, n) => ({
          ast: parseLiteral(_, undefined),
          keyName: schema.tsEnumNames![n],
        })),
        type: 'ENUM',
      }
    }
    case 'NAMED_SCHEMA':
      return newInterface(schema as SchemaSchema, options, processed, usedNames, keyName)
    case 'NEVER':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'NEVER',
      }
    case 'NULL':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'NULL',
      }
    case 'NUMBER':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'NUMBER',
      }
    case 'OBJECT':
      return {
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'OBJECT',
        deprecated: schema.deprecated,
      }
    case 'ONE_OF':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        params: parseBranches(schema.oneOf!, schema, options, processed, usedNames),
        type: 'UNION',
      }
    case 'REFERENCE':
      throw Error(format('Refs should have been resolved by the resolver!', schema))
    case 'STRING': {
      const ast = {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
      }
      // The `formatTypes` option maps a string's `format` to TypeScript type text, which is
      // emitted verbatim just like `tsType` (an explicit `tsType` never gets here: it wins).
      if (
        typeof schema.format === 'string' &&
        Object.prototype.hasOwnProperty.call(options.formatTypes, schema.format)
      ) {
        return {...ast, params: options.formatTypes[schema.format], type: 'CUSTOM_TYPE'}
      }
      return {...ast, type: 'STRING'}
    }
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        // normalised to not be undefined
        const minItems = schema.minItems!
        const maxItems = schema.maxItems!
        const arrayType: TTuple = {
          comment: schema.description,
          deprecated: schema.deprecated,
          isReadOnly: isReadOnly(schema),
          keyName,
          maxItems,
          minItems,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
          params: schema.items.map(_ => parse(_, options, undefined, processed, usedNames)),
          type: 'TUPLE',
        }
        if (schema.additionalItems === true) {
          arrayType.spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY
        } else if (schema.additionalItems) {
          arrayType.spreadParam = parse(schema.additionalItems, options, undefined, processed, usedNames)
        }
        return arrayType
      } else {
        return {
          comment: schema.description,
          deprecated: schema.deprecated,
          isReadOnly: isReadOnly(schema),
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
          params: parse(schema.items!, options, `{keyNameFromDefinition}Items`, processed, usedNames),
          type: 'ARRAY',
        }
      }
    case 'UNION':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        params: (schema.type as JSONSchema4TypeName[]).map(type => {
          const member: LinkedJSONSchema = {...omit(schema, '$id', 'description', 'title'), type}
          maybeStripDefault(member)
          applySchemaTyping(member)
          return parse(member, options, undefined, processed, usedNames)
        }),
        type: 'UNION',
      }
    case 'UNNAMED_ENUM':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        params: (schema as EnumJSONSchema).enum!.map(_ => parseLiteral(_, undefined)),
        type: 'UNION',
      }
    case 'UNNAMED_SCHEMA':
      return newInterface(schema as SchemaSchema, options, processed, usedNames, keyName, keyNameFromDefinition)
    case 'UNTYPED_ARRAY':
      // normalised to not be undefined
      const minItems = schema.minItems!
      const maxItems = typeof schema.maxItems === 'number' ? schema.maxItems : -1
      const params = options.unknownAny ? T_UNKNOWN : T_ANY
      if (minItems > 0 || maxItems >= 0) {
        return {
          comment: schema.description,
          deprecated: schema.deprecated,
          isReadOnly: isReadOnly(schema),
          keyName,
          maxItems: schema.maxItems,
          minItems,
          // create a tuple of length N
          params: Array(Math.max(maxItems, minItems) || 0).fill(params),
          // if there is no maximum, then add a spread item to collect the rest
          spreadParam: maxItems >= 0 ? undefined : params,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
          type: 'TUPLE',
        }
      }

      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        isReadOnly: isReadOnly(schema),
        keyName,
        params,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'ARRAY',
      }
  }
}

// An `allOf` member made up exclusively of keywords that don't shape a type (see `Keyword.typed`
// in `keywords.ts`; eg. `if`/`then`/`else`, `not`) is one this tool has no notion of at all, as
// opposed to eg. a bare `{type: 'object'}`, which the tool does recognize but currently renders
// no differently -- that distinction keeps `hasNoRecognizedKeywords` from also swallowing members
// whose current (separately unimplemented) behavior other schemas rely on. (`$ref` needs no
// recognizing: by the time this runs, the resolver has already replaced every `$ref` node, so
// `case 'REFERENCE'` above never fires and no schema here can carry one.)
function hasNoRecognizedKeywords(schema: NormalizedJSONSchema): boolean {
  return Object.keys(schema).every(key => !TYPE_SHAPING_KEYWORDS.has(key))
}

/**
 * True for a parsed AST that carries no information beyond the synthesized
 * `[k: string]: unknown`/`any` index signature `parseSchema` adds by default -- ie. an interface
 * with no properties, patternProperties, superTypes, comment, or standalone name of its own.
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/369
 */
function isVacuousInterface(ast: AST): boolean {
  return (
    ast.type === 'INTERFACE' &&
    ast.standaloneName === undefined &&
    ast.comment === undefined &&
    !ast.deprecated &&
    ast.superTypes.length === 0 &&
    ast.params.length === 1 &&
    ast.params[0].isIndexSignature &&
    (ast.params[0].ast.type === 'ANY' || ast.params[0].ast.type === 'UNKNOWN')
  )
}

/**
 * Parses one member of the `allOf`/`anyOf`/`oneOf` on `schema`.
 *
 * A member that only lists `required` keys -- the "factoring" pattern, where the properties
 * are declared once on the enclosing object and each branch says which of them it needs --
 * has no `properties` of its own to apply that list to, so parsed in isolation it would come
 * out as a bare `{[k: string]: unknown}` and its `required` would be lost. Instead, such a
 * member borrows the declaration of each key it lists from the schemas around it that apply to
 * the same instance (see `findDeclaration`), and becomes a pick of those with every key required
 * (`{a: A}`); the caller intersects the set operation with the enclosing schema's own
 * (all-optional) interface, so the result reads `({a: A} | {b: B}) & {a?: A; b?: B}`. Keys that
 * aren't declared anywhere are skipped, as `required` keys with no matching property are
 * everywhere else; a member with nothing left to pick, or one that says anything else about
 * itself (its own `properties`, a `title`, a non-object `type`, ...), is parsed on its own, as
 * before.
 *
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/513
 */
function parseMember(
  member: NormalizedJSONSchema,
  schema: NormalizedJSONSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): AST {
  if (isRequiredOnly(member) && !isNamed(member, options)) {
    const picked = pickDeclared(
      member.required as string[],
      key => findDeclaration(schema, key, options),
      options,
      processed,
      usedNames,
    )
    if (picked) {
      return {comment: member.description, deprecated: member.deprecated, ...picked}
    }
  }
  return parse(member, options, undefined, processed, usedNames)
}

/**
 * Parses the members of the `anyOf`/`oneOf` on `schema` and applies `schema`'s own `required` to
 * them: a key listed there that `schema` has no property of its own for, but a branch declares
 * (see `findDeclarationIn`), becomes required in that branch, so that `{oneOf: [{$ref:
 * '#/definitions/a'}, {$ref: '#/definitions/b'}], required: ['id']}` reads `(A & {id: string}) |
 * (B & {id: string})`. `parseRequired` is the `allOf` counterpart.
 *
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/395
 */
function parseBranches(
  members: NormalizedJSONSchema[],
  schema: NormalizedJSONSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): AST[] {
  const keys = undeclaredRequired(schema)
  return members.map(member => {
    const ast = parseMember(member, schema, options, processed, usedNames)
    const picked = pickDeclared(keys, key => findDeclarationIn(member, key), options, processed, usedNames)
    return picked ? {params: [ast, picked], type: 'INTERSECTION'} : ast
  })
}

/**
 * The extra `allOf` member that the `required` list next to it amounts to: the keys listed there
 * that the schema has no property of its own for (all of them, usually -- `{allOf: [{$ref:
 * '#/definitions/base'}], required: ['id']}`), each with the declaration found for it among the
 * members or further out (see `findDeclaration`), so that the example reads `Base & {id: string}`
 * rather than a plain `Base` that forgot about `id`. The referenced schema itself is left alone:
 * it is declared once, however many places refer to it and whatever they require of it.
 *
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/395
 */
function parseRequired(
  schema: NormalizedJSONSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): AST[] {
  // the intersection `applySchemaTyping` split off of a schema took its `allOf` along, but not its `required`
  const picked = pickDeclared(
    undeclaredRequired(intersectionOwner(schema) ?? schema),
    key => findDeclaration(schema, key, options),
    options,
    processed,
    usedNames,
  )
  return picked ? [picked] : []
}

/** The keys `schema` lists as `required` (draft 4+ style) but has no `properties` entry for */
function undeclaredRequired(schema: NormalizedJSONSchema): string[] {
  return Array.isArray(schema.required) ? schema.required.filter(key => !hasProperty(schema, key)) : []
}

/**
 * `{k: K}` for each of `keys` that `lookup` finds a declaration for, every one of them required;
 * `undefined` if that leaves nothing.
 */
function pickDeclared(
  keys: string[],
  lookup: (key: string) => NormalizedJSONSchema | undefined,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): TInterface | undefined {
  const params: TInterfaceParam[] = []
  new Set(keys).forEach(key => {
    const declaration = lookup(key)
    if (declaration !== undefined) {
      params.push({
        ast: parse(declaration, options, key, processed, usedNames),
        isIndexSignature: false,
        isPatternProperty: false,
        isReadOnly: isReadOnly(declaration),
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: key,
      })
    }
  })
  if (params.length) {
    return {params, superTypes: [], type: 'INTERFACE'}
  }
}

/**
 * True for a schema that says nothing but which keys are `required` (draft 4+ style) -- give or
 * take annotations, and the `type: 'object'` that is implied anyway (along with the boolean
 * `additionalProperties` the normalizer defaults next to it).
 */
function isRequiredOnly(schema: NormalizedJSONSchema): boolean {
  return (
    Array.isArray(schema.required) &&
    schema.required.length > 0 &&
    Object.keys(schema).every(
      key =>
        key === 'required' ||
        (key === 'type' && schema.type === 'object') ||
        (key === 'additionalProperties' && typeof schema.additionalProperties === 'boolean') ||
        ANNOTATION_KEYWORDS.has(key),
    )
  )
}

/**
 * The schema of property `key` as declared closest to `schema` among the schemas that apply to
 * the same instance `schema` does: `schema` itself and the members of its `allOf` (and of theirs,
 * and so on in), then -- when `schema` is just a member of an enclosing set operation -- that
 * operation's schema and its `allOf`, and so on out, for as long as the schemas on the way out are
 * objects (or don't say). Every schema visited holds for the whole instance, so requiring `key`
 * with the type found for it never asks more than the overall schema already does.
 */
function findDeclaration(
  schema: NormalizedJSONSchema,
  key: string,
  options: Options,
): NormalizedJSONSchema | undefined {
  const seen = new Set<NormalizedJSONSchema>()
  let node: NormalizedJSONSchema | undefined = schema
  while (node && isObjectOnly(node)) {
    const declaration = findDeclarationIn(node, key, seen)
    if (declaration !== undefined) {
      return declaration
    }
    node = enclosingSchema(node, options)
  }
}

/** The schema of property `key` as declared by `schema` itself or else by a member of its `allOf`, recursively */
function findDeclarationIn(
  schema: NormalizedJSONSchema,
  key: string,
  seen = new Set<NormalizedJSONSchema>(),
): NormalizedJSONSchema | undefined {
  if (seen.has(schema) || !isObjectOnly(schema)) {
    return undefined
  }
  seen.add(schema)
  if (hasProperty(schema, key)) {
    return schema.properties![key]
  }
  for (const member of (schema[Intersection] ?? schema).allOf ?? []) {
    const declaration = findDeclarationIn(member, key, seen)
    if (declaration !== undefined) {
      return declaration
    }
  }
}

/** True unless `schema`'s `type` says its instances may be something other than objects (`required` asks nothing of those) */
function isObjectOnly(schema: NormalizedJSONSchema): boolean {
  return schema.type === undefined || schema.type === 'object'
}

function hasProperty(schema: NormalizedJSONSchema, key: string): boolean {
  return schema.properties !== undefined && Object.prototype.hasOwnProperty.call(schema.properties, key)
}

/**
 * The schema whose `allOf`/`anyOf`/`oneOf` `schema` is a member of, provided `schema` is inlined
 * there and only there. A named schema (declared once, however many set operations refer to it) or
 * a shared one (dereferenced into more than one place, and parsed once for all of them) has no one
 * enclosing schema. The intersection `applySchemaTyping` split off of a schema stands for that
 * schema, and kept its `allOf` array, whose parent is still that schema.
 */
function enclosingSchema(schema: NormalizedJSONSchema, options: Options): NormalizedJSONSchema | undefined {
  const split = intersectionOwner(schema)
  if (split) {
    return split
  }
  const parent = schema[Parent]
  const owner = parent?.[Parent]
  const members: unknown = parent
  if (
    owner &&
    !schema[Shared] &&
    !isNamed(schema, options) &&
    (owner.allOf === members ||
      owner.anyOf === members ||
      owner.oneOf === members ||
      owner[Intersection]?.allOf === members)
  ) {
    return owner
  }
}

/** The schema `applySchemaTyping` split `schema` off of, if `schema` is such an intersection */
function intersectionOwner(schema: NormalizedJSONSchema): NormalizedJSONSchema | undefined {
  const parent = schema[Parent]
  return parent && parent[Intersection] === schema ? parent : undefined
}

/** True for a schema `standaloneName` will name (by a title or id since hoisted onto its intersection, maybe) */
function isNamed(schema: NormalizedJSONSchema, options: Options): boolean {
  return Boolean(nameOf(schema[Intersection] ?? schema, definitionKeyOf(schema), options))
}

/** The name a schema asks for, before it is made unique */
function nameOf(
  schema: NormalizedJSONSchema,
  keyNameFromDefinition: string | undefined,
  options: Options,
): string | undefined {
  return options.customName?.(schema, keyNameFromDefinition) || schema.title || schema.$id || keyNameFromDefinition
}

/**
 * Compute a schema name using a series of fallbacks
 */
function standaloneName(
  schema: NormalizedJSONSchema,
  keyNameFromDefinition: string | undefined,
  usedNames: UsedNames,
  options: Options,
): string | undefined {
  const name = nameOf(schema, keyNameFromDefinition, options)
  if (name) {
    return generateName(name, usedNames)
  }
}

const CLOSED_EMPTY_OBJECT_PARAM: TInterfaceParam = {
  ast: T_NEVER_ADDITIONAL_PROPERTIES,
  isIndexSignature: true,
  isPatternProperty: false,
  isRequired: true,
  isUnreachableDefinition: false,
  keyName: '[k: string]',
}

function newInterface(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
  keyName?: string,
  keyNameFromDefinition?: string,
): TInterface {
  const name = standaloneName(schema, keyNameFromDefinition, usedNames, options)!
  const params = parseSchema(schema, options, processed, usedNames, name)
  const superTypes = parseSuperTypes(schema, options, processed, usedNames)
  return {
    comment: schema.description,
    deprecated: schema.deprecated,
    keyName,
    // A closed object (`additionalProperties: false`) that declares no members of
    // its own accepts nothing but the empty object. Emitting `{}` for it would say
    // the opposite: in TypeScript `{}` accepts any non-nullish value. Express the
    // constraint with a `never` index signature instead, which is what
    // `Record<string, never>` desugars to.
    params:
      params.length === 0 && superTypes.length === 0 && schema.additionalProperties === false
        ? [CLOSED_EMPTY_OBJECT_PARAM]
        : params,
    standaloneName: name,
    superTypes,
    type: 'INTERFACE',
  }
}

function parseSuperTypes(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): TNamedInterface[] {
  // Type assertion needed because of dereferencing step
  // TODO: Type it upstream
  const superTypes = schema.extends as SchemaSchema[] | undefined
  if (!superTypes) {
    return []
  }
  return superTypes.map(_ => parse(_, options, undefined, processed, usedNames) as TNamedInterface)
}

/**
 * Draft 4+ lists an object's required properties on the object schema (`required: [...]`).
 * Draft 3 instead flagged each property schema (`required: true`), and some generators still
 * emit that form. Support both, reading the draft 3 form only when it is strictly `true` so
 * that a property's own `required` array (which of *its* properties are required) is never
 * mistaken for the flag.
 */
function isRequired(parentSchema: SchemaSchema, key: string, propertySchema: NormalizedJSONSchema): boolean {
  return propertySchema.required === true || (parentSchema.required !== true && includes(parentSchema.required, key))
}

/**
 * The draft 7 `readOnly` annotation. Only a strict `true` counts; boolean schemas carry none.
 */
function isReadOnly(schema: LinkedJSONSchema | boolean): boolean {
  return !isBoolean(schema) && schema.readOnly === true
}

/**
 * Helper to parse schema properties into params on the parent schema's type
 */
function parseSchema(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
  parentSchemaName: string,
): TInterfaceParam[] {
  const asts: TInterfaceParam[] = map(schema.properties, (value, key: string) => ({
    ast: parse(value, options, key, processed, usedNames),
    isIndexSignature: false,
    isPatternProperty: false,
    isReadOnly: isReadOnly(value),
    isRequired:
      isRequired(schema, key, value) ||
      (options.removeOptionalIfDefaultExists && !isBoolean(value) && 'default' in value),
    isUnreachableDefinition: false,
    keyName: key,
  }))

  // rendered through the index signature (below), not as params of their own
  const patternProperties: TInterfaceParam[] = map(schema.patternProperties, (value, key: string) => {
    const ast = parse(value, options, key, processed, usedNames)
    const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema definition
via the \`patternProperty\` "${key.replace('*/', '*\\/')}".`
    ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
    return {
      ast,
      isIndexSignature: false,
      isPatternProperty: true,
      isReadOnly: isReadOnly(value),
      isRequired: isRequired(schema, key, value),
      isUnreachableDefinition: false,
      keyName: key,
    }
  })

  const unreachableDefinitions: TInterfaceParam[] = !options.unreachableDefinitions
    ? []
    : map(schema.$defs, (value, key: string) => ({
        ast: parseUnreachableDefinition(value, key, parentSchemaName, options, processed, usedNames),
        isIndexSignature: false,
        isPatternProperty: false,
        isRequired: isRequired(schema, key, value),
        isUnreachableDefinition: true,
        keyName: key,
      }))

  // TypeScript cannot constrain keys by regex, so patternProperties are folded into the one
  // string index signature, typed as the union of their value types:
  let declaredOnly: TInterfaceParam[] = [] // listed only so that their named types get declared
  let indexSignatureMembers: TInterfaceParam[]
  switch (schema.additionalProperties) {
    case true: // already admits every value; the patterns are listed only to get their named types declared
      declaredOnly = patternProperties
      indexSignatureMembers = []
      break
    case undefined: // validate against the patterns alone, as if it were `false`
    case false:
      indexSignatureMembers = patternProperties
      break
    default:
      indexSignatureMembers = patternProperties.concat({
        ast: parse(schema.additionalProperties, options, '[k: string]', processed, usedNames),
        isIndexSignature: false,
        isPatternProperty: true,
        isReadOnly: isReadOnly(schema.additionalProperties),
        isRequired: false,
        isUnreachableDefinition: false,
        keyName: '[k: string]',
      })
  }

  if (!indexSignatureMembers.length && schema.additionalProperties === false) {
    return asts.concat(unreachableDefinitions)
  }

  const members = indexSignatureMembers.map(_ => _.ast)
  let indexSignature: AST
  if (!members.length) {
    indexSignature = options.unknownAny ? T_UNKNOWN_ADDITIONAL_PROPERTIES : T_ANY_ADDITIONAL_PROPERTIES
  } else if (members.length === 1) {
    indexSignature = members[0]
  } else {
    indexSignature = {
      // Members with a standalone name carry their comment on their own declaration;
      // the others' comments (which name their pattern) go on the index signature.
      comment:
        members
          .filter(_ => !hasStandaloneName(_) && _.comment)
          .map(_ => _.comment)
          .join('\n\n') || undefined,
      keyName: '[k: string]',
      type: 'UNION',
      params: members,
    }
  }

  // pass "true" for isRequired because in TS, properties
  // defined via index signatures are already optional
  const indexSignatureParam: TInterfaceParam = {
    ast: indexSignature,
    isIndexSignature: true,
    isPatternProperty: false,
    // nothing writable may come in through a readonly index signature
    isReadOnly: indexSignatureMembers.length > 0 && indexSignatureMembers.every(_ => _.isReadOnly),
    isRequired: true,
    isUnreachableDefinition: false,
    keyName: '[k: string]',
  }

  // The members of a union are also listed as non-rendered params, so that their named types are
  // still declared when the optimizer collapses it (e.g. `X | unknown` to `unknown`). They go
  // after the index signature: the optimizer rewrites only the first param that holds a given AST.
  if (indexSignatureMembers.length > 1) {
    declaredOnly = indexSignatureMembers
  }
  // Declaration order as on master: types from patternProperties before unreachable definitions,
  // a signature that comes from additionalProperties alone after them.
  return patternProperties.length
    ? asts.concat(indexSignatureParam, declaredOnly, unreachableDefinitions)
    : asts.concat(unreachableDefinitions, indexSignatureParam)
}

type Definitions = {[k: string]: NormalizedJSONSchema}

function getDefinitions(
  schema: NormalizedJSONSchema,
  isSchema = true,
  processed = new Set<NormalizedJSONSchema>(),
): Definitions {
  if (processed.has(schema)) {
    return {}
  }
  processed.add(schema)
  if (Array.isArray(schema)) {
    return schema.reduce(
      (prev, cur) => ({
        ...prev,
        ...getDefinitions(cur, false, processed),
      }),
      {},
    )
  }
  if (isPlainObject(schema)) {
    return {
      ...(isSchema && hasDefinitions(schema) ? schema.$defs : {}),
      ...Object.keys(schema).reduce<Definitions>(
        (prev, cur) => ({
          ...prev,
          ...getDefinitions(schema[cur], false, processed),
        }),
        {},
      ),
    }
  }
  return {}
}

const getDefinitionsMemoized = memoize(getDefinitions)

/**
 * Reverse index of `getDefinitions`: schema -> the first definition key that holds it,
 * built once per definitions object instead of scanning every key for every parsed node.
 */
const getDefinitionKeysMemoized = memoize((definitions: Definitions): Map<NormalizedJSONSchema, string> => {
  const keys = new Map<NormalizedJSONSchema, string>()
  for (const key of Object.keys(definitions)) {
    if (!keys.has(definitions[key])) {
      keys.set(definitions[key], key)
    }
  }
  return keys
})

/** The (first) key `schema` is held under in `definitions`, if any */
function definitionKeyOf(schema: NormalizedJSONSchema): string | undefined {
  return getDefinitionKeysMemoized(getDefinitionsMemoized(getRootSchema(schema))).get(schema)
}

/**
 * TODO: Reduce rate of false positives
 */
function hasDefinitions(schema: NormalizedJSONSchema): schema is JSONSchemaWithDefinitions {
  return '$defs' in schema
}
