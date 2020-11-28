import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {findKey, includes, isPlainObject, map} from 'lodash'
import {format} from 'util'
import {Options} from './'
import {typeOfSchema} from './typeOfSchema'
import {
  AST,
  hasStandaloneName,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
  TInterface,
  TInterfaceParam,
  TNamedInterface,
  TTuple,
  T_UNKNOWN,
  T_UNKNOWN_ADDITIONAL_PROPERTIES
} from './types/AST'
import {JSONSchema as LinkedJSONSchema, JSONSchemaWithDefinitions, SchemaSchema} from './types/JSONSchema'
import {generateName, log} from './utils'

export type Processed = Map<LinkedJSONSchema | JSONSchema4Type, AST>

export type UsedNames = Set<string>

export function parse(
  schema: LinkedJSONSchema | JSONSchema4Type,
  options: Options,
  rootSchema = schema as LinkedJSONSchema,
  keyName?: string,
  isSchema = true,
  processed: Processed = new Map<LinkedJSONSchema | JSONSchema4Type, AST>(),
  usedNames = new Set<string>()
): AST {
  // If we've seen this node before, return it.
  if (processed.has(schema)) {
    return processed.get(schema)!
  }

  const definitions = getDefinitions(rootSchema)
  const keyNameFromDefinition = findKey(definitions, _ => _ === schema)

  // Cache processed ASTs before they are actually computed, then update
  // them in place using set(). This is to avoid cycles.
  // TODO: Investigate alternative approaches (lazy-computing nodes, etc.)
  const ast = {} as AST
  processed.set(schema, ast)

  // Update the AST in place. This updates the `processed` cache, as well
  // as any nodes that directly reference the node.
  return Object.assign(
    ast,
    isSchema
      ? parseNonLiteral(
          schema as SchemaSchema,
          options,
          rootSchema,
          keyName,
          keyNameFromDefinition,
          processed,
          usedNames
        )
      : parseLiteral(schema, keyName, keyNameFromDefinition)
  )
}

function parseLiteral(
  schema: JSONSchema4Type,
  keyName: string | undefined,
  keyNameFromDefinition: string | undefined
): AST {
  return {
    keyName,
    params: schema,
    standaloneName: keyNameFromDefinition,
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
  log('blue', 'parser', schema, '<-' + typeOfSchema(schema), processed.has(schema) ? '(FROM CACHE)' : '')

  switch (typeOfSchema(schema)) {
    case 'ALL_OF':
      return {
        comment: schema.description,
        keyName,
        params: schema.allOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'INTERSECTION'
      }
    case 'ANY':
      return {
        ...(options.unknownAny ? T_UNKNOWN : T_ANY),
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames)
      }
    case 'ANY_OF':
      return {
        comment: schema.description,
        keyName,
        params: schema.anyOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'UNION'
      }
    case 'BOOLEAN':
      return {
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'BOOLEAN'
      }
    case 'CUSTOM_TYPE':
      return {
        comment: schema.description,
        keyName,
        params: schema.tsType!,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'CUSTOM_TYPE'
      }
    case 'NAMED_ENUM':
      return {
        comment: schema.description,
        keyName,
        params: schema.enum!.map((_, n) => ({
          ast: parse(_, options, rootSchema, undefined, false, processed, usedNames),
          keyName: schema.tsEnumNames![n]
        })),
        standaloneName: standaloneName(schema, keyName, usedNames)!,
        type: 'ENUM'
      }
    case 'NAMED_SCHEMA':
      return newInterface(schema as SchemaSchema, options, rootSchema, processed, usedNames, keyName)
    case 'NULL':
      return {
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'NULL'
      }
    case 'NUMBER':
      return {
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'NUMBER'
      }
    case 'OBJECT':
      return {
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'OBJECT'
      }
    case 'ONE_OF':
      return {
        comment: schema.description,
        keyName,
        params: schema.oneOf!.map(_ => parse(_, options, rootSchema, undefined, true, processed, usedNames)),
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'UNION'
      }
    case 'REFERENCE':
      throw Error(format('Refs should have been resolved by the resolver!', schema))
    case 'STRING':
      return {
        comment: schema.description,
        keyName,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'STRING'
      }
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
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'TUPLE'
        }
        if (schema.additionalItems === true) {
          arrayType.spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY
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
        return arrayType
      } else {
        const params = parse(schema.items!, options, rootSchema, undefined, true, processed, usedNames)
        return {
          comment: schema.description,
          keyName,
          params,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'ARRAY'
        }
      }
    case 'UNION':
      return {
        comment: schema.description,
        keyName,
        params: (schema.type as JSONSchema4TypeName[]).map(_ =>
          parse({...schema, type: _}, options, rootSchema, undefined, true, processed, usedNames)
        ),
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'UNION'
      }
    case 'UNNAMED_ENUM':
      return {
        comment: schema.description,
        keyName,
        params: schema.enum!.map(_ => parse(_, options, rootSchema, undefined, false, processed, usedNames)),
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'UNION'
      }
    case 'UNNAMED_SCHEMA':
      return newInterface(
        schema as SchemaSchema,
        options,
        rootSchema,
        processed,
        usedNames,
        keyName,
        keyNameFromDefinition
      )
    case 'UNTYPED_ARRAY':
      // normalised to not be undefined
      const minItems = schema.minItems!
      const maxItems = typeof schema.maxItems === 'number' ? schema.maxItems : -1
      const params = options.unknownAny ? T_UNKNOWN : T_ANY
      if (minItems > 0 || maxItems >= 0) {
        return {
          comment: schema.description,
          keyName,
          maxItems: schema.maxItems,
          minItems,
          // create a tuple of length N
          params: Array(Math.max(maxItems, minItems) || 0).fill(params),
          // if there is no maximum, then add a spread item to collect the rest
          spreadParam: maxItems >= 0 ? undefined : params,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'TUPLE'
        }
      }

      return {
        comment: schema.description,
        keyName,
        params,
        standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
        type: 'ARRAY'
      }
  }
}

/**
 * Compute a schema name using a series of fallbacks
 */
function standaloneName(
  schema: LinkedJSONSchema,
  keyNameFromDefinition: string | undefined,
  usedNames: UsedNames
): string | undefined {
  const name = schema.title || schema.id || keyNameFromDefinition
  if (name) {
    return generateName(name, usedNames)
  }
}

function newInterface(
  schema: SchemaSchema,
  options: Options,
  rootSchema: LinkedJSONSchema,
  processed: Processed,
  usedNames: UsedNames,
  keyName?: string,
  keyNameFromDefinition?: string
): TInterface {
  const name = standaloneName(schema, keyNameFromDefinition, usedNames)!
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
  rootSchema: LinkedJSONSchema,
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
  rootSchema: LinkedJSONSchema,
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
