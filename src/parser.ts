import { whiteBright } from 'cli-color'
import { JSONSchema4TypeName } from 'json-schema'
import { isPlainObject, map, some } from 'lodash'
import { typeOfSchema } from './typeOfSchema'
import { AST, T_ANY, T_ANY_ADDITIONAL_PROPERTIES, TInterfaceParam } from './types/AST'
import { JSONSchema, SchemaSchema } from './types/JSONSchema'
import { error, log } from './utils'

export function parse(
  schema: JSONSchema,
  rootSchema = schema,
  keyName?: string,
  processed = new Map<JSONSchema, AST>(),
  definitions: D
): AST {

  if (schema === rootSchema) {
    console.log('getDefinitions', getDefinitions(schema))
  }

  log(whiteBright.bgBlue('parser'), schema, '<-' + typeOfSchema(schema), processed.has(schema) ? '(FROM CACHE)' : '')

  // If we've seen this node before, return it.
  if (processed.has(schema)) {
    return processed.get(schema)!
  }

  // Cache processed ASTs before they are actually computed, then update
  // them in place using set(). This is to avoid cycles.
  // TODO: Investigate alternative approaches (lazy-computing nodes, etc.)
  let ast = {} as AST
  processed.set(schema, ast)
  const set = (_ast: AST) => Object.assign(ast, _ast)

  switch (typeOfSchema(schema)) {
    case 'ALL_OF':
      // TODO: support schema.properties
      return set({
        comment: schema.description,
        keyName,
        params: schema.allOf!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title,
        type: 'INTERSECTION'
      })
    case 'ANY':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'ANY' })
    case 'ANY_OF':
      return set({
        comment: schema.description,
        keyName,
        params: schema.anyOf!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title,
        type: 'UNION'
      })
    case 'BOOLEAN':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'BOOLEAN' })
    case 'LITERAL':
      return set({ keyName, params: schema, type: 'LITERAL' })
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
        standaloneName: computeSchemaName(schema as SchemaSchema) || (isDefinition(rootSchema, schema) ? keyName : undefined),
        type: 'INTERFACE'
      })
    case 'NULL':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'NULL' })
    case 'NUMBER':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'NUMBER' })
    case 'OBJECT':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'OBJECT' })
    case 'REFERENCE':
      throw error('Refs should have been resolved by the resolver!', schema)
    case 'STRING':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'STRING' })
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        return set({
          comment: schema.description,
          keyName,
          params: schema.items.map(_ => parse(_, rootSchema, undefined, processed)),
          standaloneName: schema.title,
          type: 'TUPLE'
        })
      } else {
        return set({
          comment: schema.description,
          keyName,
          params: parse(schema.items!, rootSchema, undefined, processed),
          standaloneName: schema.title,
          type: 'ARRAY'
        })
      }
    case 'UNION':
      return set({
        comment: schema.description,
        keyName,
        params: (schema.type as JSONSchema4TypeName[]).map(_ => parse({ required: [], type: _ }, rootSchema, undefined, processed)),
        standaloneName: schema.title,
        type: 'UNION'
      })
    case 'UNNAMED_ENUM':
      return set({
        comment: schema.description,
        keyName,
        params: schema.enum!.map(_ => parse(_, rootSchema, undefined, processed)),
        standaloneName: schema.title,
        type: 'UNION'
      })
    case 'UNNAMED_SCHEMA':
      return set({
        comment: schema.description,
        keyName,
        params: parseSchema(schema as SchemaSchema, rootSchema, processed),
        standaloneName: computeSchemaName(schema as SchemaSchema) || (isDefinition(rootSchema, schema) ? keyName : undefined),
        type: 'INTERFACE'
      })
    case 'UNTYPED_ARRAY':
      return set({
        comment: schema.description,
        keyName,
        params: T_ANY,
        standaloneName: schema.title,
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
  processed: Map<JSONSchema, AST>
): TInterfaceParam[] {

  const asts = map(schema.properties, (value, key: string) => ({
    ast: parse(value, rootSchema, key, processed),
    isRequired: (schema.required || []).includes(key),
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

function isDefinition(
  schema: JSONSchema,
  value: any,
  parentKey = '',
  processed = new Set<JSONSchema>()
): boolean {
  console.log('isDefinition', schema, value)
  if (parentKey === 'definitions' && schema === value) {
    return true
  }
  if (processed.has(schema)) {
    return false
  }
  if (!isPlainObject(schema) && !Array.isArray(schema)) {
    return false
  }
  processed.add(schema)
  return some(schema, (v, k) => isDefinition(v, value, k, processed))
}

type Definitions = { [k: string]: JSONSchema }

function getDefinitions(schema: JSONSchema, processed = new Set<JSONSchema>()): Definitions {
  if (processed.has(schema)) {
    return {}
  }
  processed.add(schema)
  if (Array.isArray(schema)) {
    return schema.reduce((prev, cur) => ({ ...prev, ...getDefinitions(cur, processed) }), {})
  }
  if (isPlainObject(schema)) {
    return {
      ...('definitions' in schema ? schema.definitions! : {}),
      ...Object.keys(schema).reduce<Definitions>((prev, cur) => ({ ...prev, ...getDefinitions(schema[cur], processed) }), {})
    }
  }
  return {}
}
