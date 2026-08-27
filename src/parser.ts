import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {findKey, includes, isPlainObject, map, omit} from 'lodash'
import {Options} from './'
import {applySchemaTyping} from './applySchemaTyping'
import type {AST, TInterface, TInterfaceParam, TIntersection, TNamedInterface, TTuple} from './types/AST'
import {T_ANY, T_ANY_ADDITIONAL_PROPERTIES, T_UNKNOWN, T_UNKNOWN_ADDITIONAL_PROPERTIES} from './types/AST'
import type {
  EnumJSONSchema,
  JSONSchemaWithDefinitions,
  LinkedJSONSchema,
  NormalizedJSONSchema,
  SchemaSchema,
  SchemaType,
} from './types/JSONSchema'
import {Intersection, Types, getRootSchema, isBoolean, isPrimitive} from './types/JSONSchema'
import {memoize} from './memoize'
import {generateName, log, maybeStripDefault} from './utils'

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
    const ast = parseAsTypeWithCache(intersection, 'ALL_OF', options, keyName, processed, usedNames) as TIntersection

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
 * Parse the root schema's `$defs` that aren't referenced anywhere else in the
 * schema, so they still get declared. This only looks at the root schema's
 * own `$defs` (not those of nested schemas), and should be called once, on
 * the root schema, regardless of its type.
 */
export function parseUnreachableDefinitions(
  rootSchema: NormalizedJSONSchema,
  rootASTName: string,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
): AST[] {
  if (!options.unreachableDefinitions) {
    return []
  }

  return map(rootSchema.$defs, (value, key: string) => {
    const ast = parse(value, options, key, processed, usedNames)
    const comment = `This interface was referenced by \`${rootASTName}\`'s JSON-Schema
via the \`definition\` "${key}".`
    ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
    ast.isUnreachableDefinition = true
    return ast
  })
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
  const definitions = getDefinitionsMemoized(getRootSchema(schema as any)) // TODO
  const keyNameFromDefinition = findKey(definitions, _ => _ === schema)

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
            ast: parse(memberSchema, options, undefined, processed, usedNames),
            memberSchema,
          }))
          .filter(({ast, memberSchema}) => !(hasNoRecognizedKeywords(memberSchema) && isVacuousInterface(ast)))
          .map(({ast}) => ast),
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
        params: schema.anyOf!.map(_ => parse(_, options, undefined, processed, usedNames)),
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
      // An enum with no allowed values can never be satisfied, so it's equivalent
      // to `never` rather than a union of zero members (which isn't valid TS).
      if ((schema as EnumJSONSchema).enum!.length === 0) {
        return {
          comment: schema.description,
          deprecated: schema.deprecated,
          keyName,
          standaloneName: enumName,
          type: 'NEVER',
        }
      }
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
        params: schema.oneOf!.map(_ => parse(_, options, undefined, processed, usedNames)),
        type: 'UNION',
      }
    case 'REFERENCE':
      // If a $ref makes it this far unresolved, the most likely cause is a $ref
      // cycle with no concrete base case -- eg. `definitions.bar` being nothing
      // but `{"$ref": "#/definitions/bar"}`, which (directly, or through a chain
      // of other $refs) only ever points back to itself and never bottoms out
      // in an actual type. There's no TypeScript equivalent for that (it's like
      // `type Bar = Bar`), so surface a targeted error instead of the generic
      // one below.
      throw new ReferenceError(
        `Failed to resolve $ref "${schema.$ref}"` +
          (keyNameFromDefinition ? ` in definition "${keyNameFromDefinition}"` : '') +
          '. This usually means the $ref is part of a cycle with no concrete base case, so it can never resolve to an actual type.',
      )
    case 'STRING':
      return {
        comment: schema.description,
        deprecated: schema.deprecated,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'STRING',
      }
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        // normalised to not be undefined
        const minItems = schema.minItems!
        const maxItems = schema.maxItems!
        const arrayType: TTuple = {
          comment: schema.description,
          deprecated: schema.deprecated,
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
      // An enum with no allowed values can never be satisfied, so it's equivalent
      // to `never` rather than a union of zero members (which isn't valid TS).
      if ((schema as EnumJSONSchema).enum!.length === 0) {
        return {
          comment: schema.description,
          deprecated: schema.deprecated,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
          type: 'NEVER',
        }
      }
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
        keyName,
        params,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames, options),
        type: 'ARRAY',
      }
  }
}

// Keywords that some matcher in `typesOfSchema`, or the `additionalProperties`/`required`
// normalizer rules, actually keys off of. An `allOf` member made up exclusively of keywords
// outside this list (eg. `if`/`then`/`else`, `not`) is one this tool has no notion of at all,
// as opposed to eg. a bare `{type: 'object'}`, which the tool does recognize but currently
// renders no differently -- that distinction keeps `hasNoRecognizedKeywords` from also
// swallowing members whose current (separately unimplemented) behavior other schemas rely on.
// (`$ref` is deliberately omitted: by the time this runs, the resolver has already replaced
// every `$ref` node, so `case 'REFERENCE'` above never fires and no schema here can carry one.)
// Keep this in sync with the keywords `typesOfSchema.ts`'s matchers check.
const RECOGNIZED_ALL_OF_MEMBER_KEYWORDS = new Set([
  '$id',
  'additionalProperties',
  'allOf',
  'anyOf',
  'const',
  'default',
  'enum',
  'extends',
  'items',
  'oneOf',
  'patternProperties',
  'properties',
  'required',
  'tsEnumNames',
  'tsType',
  'type',
])

function hasNoRecognizedKeywords(schema: NormalizedJSONSchema): boolean {
  return Object.keys(schema).every(key => !RECOGNIZED_ALL_OF_MEMBER_KEYWORDS.has(key))
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
 * Compute a schema name using a series of fallbacks
 */
function standaloneName(
  schema: NormalizedJSONSchema,
  keyNameFromDefinition: string | undefined,
  usedNames: UsedNames,
  options: Options,
): string | undefined {
  const name =
    options.customName?.(schema, keyNameFromDefinition) || schema.title || schema.$id || keyNameFromDefinition
  if (name) {
    return generateName(name, usedNames)
  }
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
  return {
    comment: schema.description,
    deprecated: schema.deprecated,
    keyName,
    params: parseSchema(schema, options, processed, usedNames, name),
    standaloneName: name,
    superTypes: parseSuperTypes(schema, options, processed, usedNames),
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
 * Helper to parse schema properties into params on the parent schema's type
 */
function parseSchema(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames,
  parentSchemaName: string,
): TInterfaceParam[] {
  let asts: TInterfaceParam[] = map(schema.properties, (value, key: string) => ({
    ast: parse(value, options, key, processed, usedNames),
    isIndexSignature: false,
    isPatternProperty: false,
    isRequired: includes(schema.required || [], key),
    isUnreachableDefinition: false,
    keyName: key,
  }))

  let singlePatternProperty = false
  if (schema.patternProperties) {
    // partially support patternProperties. in the case that
    // additionalProperties is not set, and there is only a single
    // value definition, we can validate against that.
    singlePatternProperty = !schema.additionalProperties && Object.keys(schema.patternProperties).length === 1

    asts = asts.concat(
      map(schema.patternProperties, (value, key: string) => {
        const ast = parse(value, options, key, processed, usedNames)
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema definition
via the \`patternProperty\` "${key.replace('*/', '*\\/')}".`
        ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
        return {
          ast,
          isIndexSignature: singlePatternProperty,
          isPatternProperty: !singlePatternProperty,
          isRequired: singlePatternProperty || includes(schema.required || [], key),
          isUnreachableDefinition: false,
          keyName: singlePatternProperty ? '[k: string]' : key,
        }
      }),
    )
  }

  // handle additionalProperties
  switch (schema.additionalProperties) {
    case undefined:
    case true:
      if (singlePatternProperty) {
        return asts
      }
      return asts.concat({
        ast: options.unknownAny ? T_UNKNOWN_ADDITIONAL_PROPERTIES : T_ANY_ADDITIONAL_PROPERTIES,
        isIndexSignature: true,
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: '[k: string]',
      })

    case false:
      return asts

    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default:
      return asts.concat({
        ast: parse(schema.additionalProperties, options, '[k: string]', processed, usedNames),
        isIndexSignature: true,
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: '[k: string]',
      })
  }
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
 * TODO: Reduce rate of false positives
 */
function hasDefinitions(schema: NormalizedJSONSchema): schema is JSONSchemaWithDefinitions {
  return '$defs' in schema
}
