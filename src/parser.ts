import { whiteBright } from 'cli-color'
import { JSONSchema4Type, JSONSchema4TypeName } from 'json-schema'
import { findKey, includes, isPlainObject, map } from 'lodash'
import { typeOfSchema } from './typeOfSchema'
import { AST, T_ANY, T_ANY_ADDITIONAL_PROPERTIES, TInterfaceParam } from './types/AST'
import { JSONSchema, JSONSchemaWithDefinitions, SchemaSchema } from './types/JSONSchema'
import { error, log } from './utils'

export function parse(
  schema: JSONSchema | JSONSchema4Type,
  rootSchema = schema as JSONSchema,
  keyName?: string,
  processed = new Map<JSONSchema | JSONSchema4Type, AST>()
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
  let ast = {} as AST
  processed.set(schema, ast)
  const set = (_ast: AST) => Object.assign(ast, _ast)

  return isSchema(schema)
    ? parseNonLiteral(schema, rootSchema, keyName, keyNameFromDefinition, set, processed)
    : parseLiteral(schema, keyName, keyNameFromDefinition, set)
}

function parseLiteral(
  schema: JSONSchema4Type,
  keyName: string | undefined,
  keyNameFromDefinition: string | undefined,
  set: (ast: AST) => AST
) {
  return set({
    keyName,
    params: schema,
    standaloneName: keyNameFromDefinition,
    type: 'LITERAL'
  })
}

function parseNonLiteral(
  schema: JSONSchema,
  rootSchema: JSONSchema,
  keyName: string | undefined,
  keyNameFromDefinition: string | undefined,
  set: (ast: AST) => AST,
  processed: Map<JSONSchema | JSONSchema4Type, AST>
) {

  log(whiteBright.bgBlue('parser'), schema, '<-' + typeOfSchema(schema), processed.has(schema) ? '(FROM CACHE)' : '')

  switch (typeOfSchema(schema)) {
    case 'ALL_OF':
      return set({
        comment: schema.description,
        keyName,
        params: schema.allOf!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'INTERSECTION'
      })
    case 'ANY':
      return set({
        comment: schema.description,
        keyName,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'ANY'
      })
    case 'ANY_OF':
      return set({
        comment: schema.description,
        keyName,
        params: schema.anyOf!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'UNION'
      })
    case 'BOOLEAN':
      return set({
        comment: schema.description,
        keyName,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'BOOLEAN'
      })
    case 'NAMED_ENUM':
      return set({
        comment: schema.description,
        keyName,
        params: schema.enum!.map((_, n) => ({
          ast: parse(_, rootSchema, undefined, processed),
          keyName: schema.tsEnumNames![n]
        })),
        standaloneName: keyName!,
        type: 'ENUM'
      })
    case 'NAMED_SCHEMA':
      return set({
        comment: schema.description,
        keyName,
        params: parseSchema(schema as SchemaSchema, rootSchema, processed),
        standaloneName: computeSchemaName(schema as SchemaSchema),
        type: 'INTERFACE'
      })
    case 'NULL':
      return set({
        comment: schema.description,
        keyName,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'NULL'
      })
    case 'NUMBER':
      return set({
        comment: schema.description,
        keyName,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'NUMBER'
      })
    case 'OBJECT':
      return set({
        comment: schema.description,
        keyName,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'OBJECT'
      })
    case 'ONE_OF':
      return set({
        comment: schema.description,
        keyName,
        params: schema.oneOf!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'UNION'
      })
    case 'REFERENCE':
      throw error('Refs should have been resolved by the resolver!', schema)
    case 'STRING':
      return set({
        comment: schema.description,
        keyName,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'STRING'
      })
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        return set({
          comment: schema.description,
          keyName,
          params: schema.items.map(_ => parse(_, rootSchema, undefined, processed)),
          standaloneName: schema.title || keyNameFromDefinition,
          type: 'TUPLE'
        })
      } else {
        return set({
          comment: schema.description,
          keyName,
          params: parse(schema.items!, rootSchema, undefined, processed),
          standaloneName: schema.title || keyNameFromDefinition,
          type: 'ARRAY'
        })
      }
    case 'UNION':
      return set({
        comment: schema.description,
        keyName,
        params: (schema.type as JSONSchema4TypeName[]).map(_ => parse({ required: [], type: _ }, rootSchema, undefined, processed)),
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'UNION'
      })
    case 'UNNAMED_ENUM':
      return set({
        comment: schema.description,
        keyName,
        params: schema.enum!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'UNION'
      })
    case 'UNNAMED_SCHEMA':
      return set({
        comment: schema.description,
        keyName,
        params: parseSchema(schema as SchemaSchema, rootSchema, processed),
        standaloneName: computeSchemaName(schema as SchemaSchema)
                     || keyNameFromDefinition,
        type: 'INTERFACE'
      })
    case 'UNTYPED_ARRAY':
      return set({
        comment: schema.description,
        keyName,
        params: T_ANY,
        standaloneName: schema.title || keyNameFromDefinition,
        type: 'ARRAY'
      })
  }
}

/**
 * Compute a schema name using a series of fallbacks
 */
function computeSchemaName(schema: SchemaSchema): string | undefined {
  return schema.title || schema.id
}

/**
 * Helper to parse schema properties into params on the parent schema's type
 */
function parseSchema(
  schema: SchemaSchema,
  rootSchema: JSONSchema,
  processed: Map<JSONSchema | JSONSchema4Type, AST>
): TInterfaceParam[] {

  const asts = map(schema.properties, (value, key: string) => ({
    ast: parse(value, rootSchema, key, processed),
    isRequired: includes(schema.required || [], key),
    keyName: key
  }))

  // handle additionalProperties
  switch (schema.additionalProperties) {
    case undefined:
    case true:
      return asts.concat({
        ast: T_ANY_ADDITIONAL_PROPERTIES,
        isRequired: true,
        keyName: '[k: string]'
      })

    case false:
      return asts

    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default:
      return asts.concat({
        ast: parse(schema.additionalProperties, rootSchema, '[k: string]', processed),
        isRequired: true,
        keyName: '[k: string]'
      })
  }
}

type Definitions = { [k: string]: JSONSchema }

/**
 * TODO: Memoize
 */
function getDefinitions(schema: JSONSchema, processed = new Set<JSONSchema>()): Definitions {
  if (processed.has(schema)) {
    return {}
  }
  processed.add(schema)
  if (Array.isArray(schema)) {
    return schema.reduce((prev, cur) => ({
      ...prev,
      ...getDefinitions(cur, processed)
    }), {})
  }
  if (isPlainObject(schema)) {
    return {
      ...(hasDefinitions(schema) ? schema.definitions! : {}),
      ...Object.keys(schema).reduce<Definitions>((prev, cur) => ({
        ...prev,
        ...getDefinitions(schema[cur], processed)
      }), {})
    }
  }
  return {}
}

/**
 * TODO: Reduce rate of false positives
 */
function hasDefinitions(schema: JSONSchema): schema is JSONSchemaWithDefinitions {
  return isPlainObject(schema)
      && 'definitions' in schema
      && Object.keys(schema.definitions).every(_ => isPlainObject(schema.definitions![_]))
}

function isSchema(schema: JSONSchema | JSONSchema4Type): schema is JSONSchema {
  return isPlainObject(schema)
}
