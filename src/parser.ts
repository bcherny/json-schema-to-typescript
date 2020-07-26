import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {findKey, includes, isPlainObject, map, memoize} from 'lodash'
import {format} from 'util'
import {Options} from './'
import {typesOfSchema} from './typesOfSchema'
import {
  AST,
  hasStandaloneName,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
  TInterface,
  TInterfaceParam,
  TNamedInterface,
  TTuple,
  TIntersection,
  T_UNKNOWN,
  T_UNKNOWN_ADDITIONAL_PROPERTIES,
  TUnknown
} from './types/AST'
import {JSONSchemaWithDefinitions, SchemaSchema, SchemaType, LinkedJSONSchema} from './types/JSONSchema'
import {generateName, log, joinStrings} from './utils'

export type Processed = Map<LinkedJSONSchema | JSONSchema4Type, Map<SchemaType, AST>>

export type UsedNames = Set<string>

export function parse(
  schema: LinkedJSONSchema | JSONSchema4Type,
  options: Options,
  rootSchema = schema as LinkedJSONSchema, // TODO: Is this always the right assumption?
  keyName?: string,
  isSchema = true,
  processed: Processed = new Map(),
  usedNames = new Set<string>()
): AST {
  const definitions = getDefinitions(rootSchema)
  const keyNameFromDefinition = findKey(definitions, _ => _ === schema)

  return isSchema
    ? parseNonLiteral(schema as SchemaSchema, options, rootSchema, keyName, keyNameFromDefinition, processed, usedNames)
    : parseLiteral(schema, keyName, keyNameFromDefinition)
}

function parseLiteral(
  schema: JSONSchema4Type,
  keyName: string | undefined,
  keyNameFromDefinition: string | undefined
): AST {
  return {
    keyName,
    params: schema,
    standaloneName: () => keyNameFromDefinition,
    type: 'LITERAL'
  }
}

function parseNonLiteral(
  schema: LinkedJSONSchema,
  options: Options,
  rootSchema: LinkedJSONSchema,
  keyName: string | undefined,
  keyNameFromDefinition: string | undefined,
  processed: Processed,
  usedNames: UsedNames
): AST {
  if (!processed.has(schema)) {
    log('blue', 'parser', typesOfSchema(schema), 'Input:', schema)
  }

  const asts = typesOfSchema(schema).map(
    (type): AST => {
      if (!processed.has(schema)) {
        processed.set(schema, new Map())
      }

      // If we've seen this node before, return it.
      if (processed.get(schema)!.has(type)) {
        return processed.get(schema)!.get(type)!
      }

      // Cache processed ASTs before they are actually computed, then update
      // them in place using set(). This is to avoid cycles.
      // TODO: Investigate alternative approaches (lazy-computing nodes, etc.)
      const ast = {} as AST
      const set = (_: AST): AST => Object.assign(ast, _)

      processed.get(schema)!.set(type, ast)!

      switch (type) {
        case 'ALL_OF':
          return set({
            comment: schema.description,
            keyName,
            params: schema.allOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'INTERSECTION'
          })
        case 'ANY':
          if (options.unknownAny) {
            return set({
              comment: schema.description,
              keyName,
              standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
              type: 'UNKNOWN'
            })
          }
          return set({
            comment: schema.description,
            keyName,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'ANY'
          })
        case 'ANY_OF':
          return set({
            comment: schema.description,
            keyName,
            params: schema.anyOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'UNION'
          })
        case 'BOOLEAN':
          return set({
            comment: schema.description,
            keyName,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'BOOLEAN'
          })
        case 'CUSTOM_TYPE':
          return set({
            comment: schema.description,
            keyName,
            params: schema.tsType!,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'CUSTOM_TYPE'
          })
        case 'NAMED_ENUM':
          return set({
            comment: schema.description,
            keyName,
            params: schema.enum!.map((_, n) => ({
              ast: parse(_, options, rootSchema, undefined, false, processed, usedNames),
              keyName: schema.tsEnumNames![n]
            })),
            standaloneName: () => standaloneName(schema, keyName, usedNames)!,
            type: 'ENUM'
          })
        case 'NAMED_SCHEMA':
          return set(newInterface(schema as SchemaSchema, options, rootSchema, processed, usedNames, keyName))
        case 'NULL':
          return set({
            comment: schema.description,
            keyName,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'NULL'
          })
        case 'NUMBER':
          return set({
            comment: schema.description,
            keyName,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'NUMBER'
          })
        case 'OBJECT':
          return set({
            comment: schema.description,
            keyName,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'OBJECT'
          })
        case 'ONE_OF':
          return set({
            comment: schema.description,
            keyName,
            params: schema.oneOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'UNION'
          })
        case 'REFERENCE':
          throw Error(format('Refs should have been resolved by the resolver!', schema))
        case 'STRING':
          return set({
            comment: schema.description,
            keyName,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'STRING'
          })
        case 'TYPED_ARRAY':
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
              standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
              type: 'TUPLE'
            }
            if (schema.additionalItems === true) {
              arrayType.spreadParam = T_ANY
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
          } else {
            const params = parse(schema.items!, options, rootSchema, undefined, true, processed, usedNames)
            return set({
              comment: schema.description,
              keyName,
              params,
              standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
              type: 'ARRAY'
            })
          }
        case 'UNION':
          return set({
            comment: schema.description,
            keyName,
            params: (schema.type as JSONSchema4TypeName[]).map(_ =>
              parse({...schema, type: _}, options, rootSchema, undefined, true, processed, usedNames)
            ),
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'UNION'
          })
        case 'UNNAMED_ENUM':
          return set({
            comment: schema.description,
            keyName,
            params: schema.enum!.map(_ => parse(_, options, rootSchema, undefined, false, processed, usedNames)),
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'UNION'
          })
        case 'UNNAMED_SCHEMA':
          return set(
            newInterface(
              schema as SchemaSchema,
              options,
              rootSchema,
              processed,
              usedNames,
              keyName,
              keyNameFromDefinition
            )
          )
        case 'UNTYPED_ARRAY':
          // normalised to not be undefined
          const minItems = schema.minItems!
          const maxItems = typeof schema.maxItems === 'number' ? schema.maxItems : -1
          const params = options.unknownAny ? T_UNKNOWN : T_ANY
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
              standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
              type: 'TUPLE'
            })
          }

          return set({
            comment: schema.description,
            keyName,
            params,
            standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'ARRAY'
          })
      }
    }
  )

  if (asts.length === 1) {
    return asts[0]!
  }

  return {
    keyName,
    params: asts.map(_ => {
      _.standaloneName = () => undefined
      return _
    }),
    standaloneName: () => standaloneName(schema, keyNameFromDefinition, usedNames),
    type: 'INTERSECTION'
  } as TIntersection
}

/**
 * Compute a schema name using a series of fallbacks
 */
const standaloneName = memoize(
  (schema: LinkedJSONSchema, keyNameFromDefinition: string | undefined, usedNames: UsedNames): string | undefined => {
    const name = schema.title || schema.id || keyNameFromDefinition
    if (name) {
      return generateName(name, usedNames)
    }
  }
)

function newInterface(
  schema: SchemaSchema,
  options: Options,
  rootSchema: LinkedJSONSchema,
  processed: Processed,
  usedNames: UsedNames,
  keyName?: string,
  keyNameFromDefinition?: string
): TInterface | TIntersection {
  const name = standaloneName(schema, keyNameFromDefinition, usedNames)!
  const ast = {
    comment: schema.description,
    keyName,
    params: parseParams(schema, options, rootSchema, processed, usedNames, name),
    standaloneName: () => name,
    superTypes: parseSuperTypes(schema, options, processed, usedNames),
    type: 'INTERFACE'
  } as TInterface

  // For any required properties that aren't yet included, intersect generated types
  // with {keyName: unknown} to make those properties required.
  const requiredPropertiesThatAreNotYetCaptured = schema.required.filter(
    _ => !ast.params.some(({keyName}) => keyName === _)
  )
  if (requiredPropertiesThatAreNotYetCaptured.length) {
    // Move the standalone name from the type to its new parent intersection type
    const {standaloneName} = ast
    ast.standaloneName = () => undefined
    return {
      params: [
        ast,
        ...requiredPropertiesThatAreNotYetCaptured.map(
          keyName =>
            ({
              keyName,
              standaloneName: () => undefined,
              type: 'UNKNOWN'
            } as TUnknown)
        )
      ],
      standaloneName,
      type: 'INTERSECTION'
    } as TIntersection
  }

  return ast
}

function parseSuperTypes(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames
): (TNamedInterface | TIntersection)[] {
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
  rootSchema: LinkedJSONSchema,
  processed: Processed,
  usedNames: UsedNames
): TNamedInterface | TIntersection {
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
function parseParams(
  schema: SchemaSchema,
  options: Options,
  rootSchema: LinkedJSONSchema,
  processed: Processed,
  usedNames: UsedNames,
  parentSchemaName: string
): TInterfaceParam[] {
  let asts: TInterfaceParam[] = map(schema.properties, (value, key) => ({
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

    asts = [
      ...asts,
      ...map(schema.patternProperties, (value, key) => {
        const ast = parse(value, options, rootSchema, key, true, processed, usedNames)
        ast.comment = joinStrings(
          ast.comment,
          `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema definition
via the \`patternProperty\` "${key}".`
        )
        return {
          ast,
          isPatternProperty: !singlePatternProperty,
          isRequired: singlePatternProperty || includes(schema.required || [], key),
          isUnreachableDefinition: false,
          keyName: singlePatternProperty ? '[k: string]' : key
        }
      })
    ]
  }

  if (options.unreachableDefinitions) {
    asts = asts.concat(
      map(schema.definitions, (value, key) => {
        const ast = parse(value, options, rootSchema, key, true, processed, usedNames)
        ast.comment = joinStrings(
          ast.comment,
          `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema
via the \`definition\` "${key}".`
        )
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
        ast: options.unknownAny ? T_UNKNOWN_ADDITIONAL_PROPERTIES : T_ANY_ADDITIONAL_PROPERTIES,
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

type Definitions = {[k: string]: LinkedJSONSchema}

/**
 * TODO: Memoize
 */
function getDefinitions(
  schema: LinkedJSONSchema,
  isSchema = true,
  processed = new Set<LinkedJSONSchema>()
): Definitions {
  if (processed.has(schema)) {
    return {}
  }
  processed.add(schema)
  if (Array.isArray(schema)) {
    return schema.reduce(
      (prev, cur) => ({
        ...prev,
        ...getDefinitions(cur, false, processed)
      }),
      {}
    )
  }
  if (isPlainObject(schema)) {
    return {
      ...(isSchema && hasDefinitions(schema) ? schema.definitions : {}),
      ...Object.keys(schema).reduce<Definitions>(
        (prev, cur) => ({
          ...prev,
          ...getDefinitions(schema[cur], false, processed)
        }),
        {}
      )
    }
  }
  return {}
}

/**
 * TODO: Reduce rate of false positives
 */
function hasDefinitions(schema: LinkedJSONSchema): schema is JSONSchemaWithDefinitions {
  return 'definitions' in schema
}
