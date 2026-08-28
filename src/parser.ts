import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {findKey, includes, isPlainObject, map, omit} from 'lodash'
import {format} from 'util'
import {Options} from './'
import {applySchemaTyping} from './applySchemaTyping'
import type {AST, TInterface, TInterfaceParam, TIntersection, TNamedInterface, TTuple} from './types/AST'
import {
  hasStandaloneName,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
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
        params: schema.allOf!.map(_ => parse(_, options, undefined, processed, usedNames)),
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
      throw Error(format('Refs should have been resolved by the resolver!', schema))
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
    isRequired: isRequired(schema, key, value),
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
      isRequired: isRequired(schema, key, value),
      isUnreachableDefinition: false,
      keyName: key,
    }
  })

  const unreachableDefinitions: TInterfaceParam[] = !options.unreachableDefinitions
    ? []
    : map(schema.$defs, (value, key: string) => {
        const ast = parse(value, options, key, processed, usedNames)
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema
via the \`definition\` "${key}".`
        ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
        ast.isUnreachableDefinition = true
        return {
          ast,
          isIndexSignature: false,
          isPatternProperty: false,
          isRequired: isRequired(schema, key, value),
          isUnreachableDefinition: true,
          keyName: key,
        }
      })

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
 * TODO: Reduce rate of false positives
 */
function hasDefinitions(schema: NormalizedJSONSchema): schema is JSONSchemaWithDefinitions {
  return '$defs' in schema
}
