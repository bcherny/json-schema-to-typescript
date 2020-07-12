import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {includes, isPlainObject, map} from 'lodash'
import {format} from 'util'
import {Options} from './'
import {typesOfSchema} from './typeOfSchema'
import {
  AST,
  hasStandaloneName,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
  TInterface,
  TInterfaceParam,
  TNamedInterface,
  TTuple,
  TArray,
  TUnion,
  TString,
  TObject,
  TNumber,
  TNull,
  TEnum,
  TCustomType,
  TBoolean,
  TAny,
  TIntersection
} from './types/AST'
import {JSONSchema, SchemaSchema} from './types/JSONSchema'
import {generateName, log} from './utils'
import {ORIGINAL_REF_SYMBOL} from '@apidevtools/json-schema-ref-parser'

export type Processed = Map<JSONSchema | JSONSchema4Type, AST>

export type UsedNames = Set<string>

export function parse(
  schema: JSONSchema | JSONSchema4Type,
  options: Options,
  rootSchema = schema as JSONSchema,
  keyName?: string,
  isSchema = true,
  processed: Processed = new Map<JSONSchema | JSONSchema4Type, AST>(),
  usedNames = new Set<string>()
): AST {
  // If we've seen this node before, return it.
  if (processed.has(schema)) {
    return processed.get(schema)!
  }

  // Cache processed ASTs before they are actually computed, then update
  // them in place using set(). This is to avoid cycles.
  // TODO: Investigate alternative approaches (lazy-computing nodes, etc.)
  const ast = {} as AST
  processed.set(schema, ast)
  const set = (_ast: AST) => Object.assign(ast, _ast)

  return isSchema
    ? parseNonLiteral(schema as SchemaSchema, options, rootSchema, keyName, set, processed, usedNames)
    : parseLiteral(schema, keyName, set)
}

/**
 * Compute a schema name using a series of fallbacks
 */
function getStandaloneName(schema: JSONSchema, keyName: string | undefined, usedNames: UsedNames): string | undefined {
  if (schema.title) {
    return generateName(schema.title, usedNames)
  }
  if (schema.id) {
    return generateName(schema.id, usedNames)
  }
  const keyNameFromRef = isPlainObject(schema) ? (schema as any)[ORIGINAL_REF_SYMBOL as any] : null
  if (keyNameFromRef) {
    return generateName(keyNameFromRef.slice(keyNameFromRef.lastIndexOf('/')), usedNames)
  }
  if (schema.tsEnumNames && keyName) {
    return generateName(keyName, usedNames)
  }
  return undefined
}

function parseLiteral(schema: JSONSchema4Type, keyName: string | undefined, set: (ast: AST) => AST): AST {
  return set({
    keyName,
    params: schema,
    type: 'LITERAL'
  })
}

function parseNonLiteral(
  schema: JSONSchema,
  options: Options,
  rootSchema: JSONSchema,
  keyName: string | undefined,
  set: (ast: AST) => AST,
  processed: Processed,
  usedNames: UsedNames
): AST {
  const standaloneName = getStandaloneName(schema, keyName, usedNames)

  log(
    'blue',
    'parser',
    schema,
    '<-',
    typesOfSchema(schema),
    standaloneName ? '"' + standaloneName + '"' : '',
    processed.has(schema) ? '(FROM CACHE)' : ''
  )

  const asts = typesOfSchema(schema).map(type => {
    switch (type) {
      case 'ALL_OF':
        return set({
          comment: schema.description,
          keyName,
          params: schema.allOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
          standaloneName,
          type: 'INTERSECTION'
        }) as TIntersection
      case 'ANY':
        return set({
          comment: schema.description,
          keyName,
          standaloneName,
          type: 'ANY'
        }) as TAny
      case 'ANY_OF':
        return set({
          comment: schema.description,
          keyName,
          params: schema.anyOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
          standaloneName,
          type: 'UNION'
        }) as TUnion
      case 'BOOLEAN':
        return set({
          comment: schema.description,
          keyName,
          standaloneName,
          type: 'BOOLEAN'
        }) as TBoolean
      case 'CUSTOM_TYPE':
        return set({
          comment: schema.description,
          keyName,
          params: schema.tsType!,
          standaloneName,
          type: 'CUSTOM_TYPE'
        }) as TCustomType
      case 'NAMED_ENUM':
        return set({
          comment: schema.description,
          keyName,
          params: schema.enum!.map((_, n) => ({
            ast: parse(_, options, rootSchema, undefined, false, processed, usedNames),
            keyName: schema.tsEnumNames![n]
          })),
          standaloneName: standaloneName!,
          type: 'ENUM'
        }) as TEnum
      case 'NAMED_SCHEMA':
        return set(newInterface(schema as SchemaSchema, options, rootSchema, processed, usedNames, keyName))
      case 'NULL':
        return set({
          comment: schema.description,
          keyName,
          standaloneName,
          type: 'NULL'
        }) as TNull
      case 'NUMBER':
        return set({
          comment: schema.description,
          keyName,
          standaloneName,
          type: 'NUMBER'
        }) as TNumber
      case 'OBJECT':
        return set({
          comment: schema.description,
          keyName,
          standaloneName,
          type: 'OBJECT'
        }) as TObject
      case 'ONE_OF':
        return set({
          comment: schema.description,
          keyName,
          params: schema.oneOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
          standaloneName,
          type: 'UNION'
        }) as TUnion
      case 'REFERENCE':
        throw Error(format('Refs should have been resolved by the resolver!', schema))
      case 'STRING':
        return set({
          comment: schema.description,
          keyName,
          standaloneName,
          type: 'STRING'
        }) as TString
      case 'TYPED_ARRAY': {
        if (Array.isArray(schema.items)) {
          // normalised to not be undefined
          const minItems = schema.minItems!
          const maxItems = schema.maxItems!
          const arrayType: TTuple = {
            comment: schema.description,
            keyName,
            maxItems,
            minItems,
            params: schema.items.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
            standaloneName,
            type: 'TUPLE'
          }
          if (schema.additionalItems === true) {
            arrayType.spreadParam = {
              type: 'ANY'
            }
          } else if (schema.additionalItems) {
            arrayType.spreadParam = parse(
              schema.additionalItems,
              options,
              rootSchema,
              undefined,
              true,
              processed,
              usedNames
            )
          }
          return set(arrayType)
        }
        const params = parse(schema.items!, options, rootSchema, undefined, true, processed, usedNames)
        return set({
          comment: schema.description,
          keyName,
          params,
          standaloneName,
          type: 'ARRAY'
        }) as TArray
      }
      case 'UNION':
        return set({
          comment: schema.description,
          keyName,
          params: (schema.type as JSONSchema4TypeName[]).map(_ =>
            parse({...schema, type: _}, options, rootSchema, undefined, true, processed, usedNames)
          ),
          standaloneName,
          type: 'UNION'
        }) as TUnion
      case 'UNNAMED_ENUM':
        return set({
          comment: schema.description,
          keyName,
          params: schema.enum!.map(_ => parse(_, options, rootSchema, undefined, false, processed, usedNames)),
          standaloneName,
          type: 'UNION'
        }) as TUnion
      case 'UNNAMED_SCHEMA':
        return set(newInterface(schema as SchemaSchema, options, rootSchema, processed, usedNames, keyName))

      case 'UNTYPED_ARRAY':
        // normalised to not be undefined
        const minItems = schema.minItems!
        const maxItems = typeof schema.maxItems === 'number' ? schema.maxItems : -1
        const params = T_ANY
        if (minItems > 0 || maxItems >= 0) {
          return set({
            comment: schema.description,
            keyName,
            maxItems: schema.maxItems,
            minItems,
            // create a tuple of length N
            params: Array(Math.max(maxItems, minItems) || 0).fill(params),
            // if there is no maximum, then add a spread item to collect the rest
            spreadParam: maxItems >= 0 ? undefined : params,
            standaloneName,
            type: 'TUPLE'
          }) as TTuple
        }
        return set({
          comment: schema.description,
          keyName,
          params,
          standaloneName,
          type: 'ARRAY'
        }) as TArray
    }
  })

  if (asts.length === 1) {
    // Special case for enums
    // if ('standaloneName' in asts[0]) {
    return asts[0]
    // }
    // const name = standaloneName(schema, usedNames)
    // return set(Object.assign(asts[0], {standaloneName: name}))
  }

  return set({
    comment: schema.description,
    keyName,
    params: asts,
    standaloneName: getStandaloneName(schema, keyName, usedNames),
    type: 'INTERSECTION'
  })
}

function newInterface(
  schema: SchemaSchema,
  options: Options,
  rootSchema: JSONSchema,
  processed: Processed,
  usedNames: UsedNames,
  keyName?: string
): TInterface {
  const name = getStandaloneName(schema, keyName, usedNames)!
  return {
    comment: schema.description,
    keyName,
    params: parseSchema(schema, options, rootSchema, processed, usedNames, name),
    standaloneName: name,
    superTypes: parseSuperTypes(schema, options, processed, usedNames),
    type: 'INTERFACE'
  }
}

function parseSuperTypes(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames
): TNamedInterface[] {
  // Type assertion needed because of dereferencing step
  // TODO: Type it upstream
  const superTypes = schema.extends as SchemaSchema | SchemaSchema[] | undefined
  if (!superTypes) {
    return []
  }
  if (Array.isArray(superTypes)) {
    return superTypes.map(_ => newNamedInterface(_, options, _, processed, usedNames))
  }
  return [newNamedInterface(superTypes, options, superTypes, processed, usedNames)]
}

function newNamedInterface(
  schema: SchemaSchema,
  options: Options,
  rootSchema: JSONSchema,
  processed: Processed,
  usedNames: UsedNames
): TNamedInterface {
  const namedInterface = newInterface(schema, options, rootSchema, processed, usedNames)
  if (hasStandaloneName(namedInterface)) {
    return namedInterface
  }
  // TODO: Generate name if it doesn't have one
  throw Error(format('Supertype must have standalone name!', namedInterface))
}

/**
 * Helper to parse schema properties into params on the parent schema's type
 */
function parseSchema(
  schema: SchemaSchema,
  options: Options,
  rootSchema: JSONSchema,
  processed: Processed,
  usedNames: UsedNames,
  parentSchemaName: string
): TInterfaceParam[] {
  let asts: TInterfaceParam[] = map(schema.properties, (value, key: string) => ({
    ast: parse(value, options, rootSchema, key, true, processed, usedNames),
    isPatternProperty: false,
    isRequired: includes(schema.required || [], key),
    isUnreachableDefinition: false,
    keyName: key
  }))

  let singlePatternProperty = false
  if (schema.patternProperties) {
    // partially support patternProperties. in the case that
    // additionalProperties is not set, and there is only a single
    // value definition, we can validate against that.
    singlePatternProperty = !schema.additionalProperties && Object.keys(schema.patternProperties).length === 1

    asts = asts.concat(
      map(schema.patternProperties, (value, key: string) => {
        const ast = parse(value, options, rootSchema, key, true, processed, usedNames)
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema definition
via the \`patternProperty\` "${key}".`
        ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
        return {
          ast,
          isPatternProperty: !singlePatternProperty,
          isRequired: singlePatternProperty || includes(schema.required || [], key),
          isUnreachableDefinition: false,
          keyName: singlePatternProperty ? '[k: string]' : key
        }
      })
    )
  }

  if (options.unreachableDefinitions) {
    asts = asts.concat(
      map(schema.definitions, (value, key: string) => {
        const ast = parse(value, options, rootSchema, key, true, processed, usedNames)
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema
via the \`definition\` "${key}".`
        ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
        return {
          ast,
          isPatternProperty: false,
          isRequired: includes(schema.required || [], key),
          isUnreachableDefinition: true,
          keyName: key
        }
      })
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
        ast: T_ANY_ADDITIONAL_PROPERTIES,
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: '[k: string]'
      })

    case false:
      return asts

    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default:
      return asts.concat({
        ast: parse(schema.additionalProperties, options, rootSchema, '[k: string]', true, processed, usedNames),
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: '[k: string]'
      })
  }
}
