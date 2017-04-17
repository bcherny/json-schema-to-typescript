import { whiteBright } from 'cli-color'
import { JSONSchema4TypeName } from 'json-schema'
import { map } from 'lodash'
import { typeOfSchema } from './typeOfSchema'
import { AST, ASTWithName, T_ANY, T_ANY_ADDITIONAL_PROPERTIES, TInterfaceParam } from './types/AST'
import { JSONSchema, SchemaSchema } from './types/JSONSchema'
import { error, log } from './utils'

export function parse(
  schema: JSONSchema,
  keyName?: string,
  processed = new Map<JSONSchema, AST>()
): AST {

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
        params: schema.allOf!.map(_ => parse(_, undefined, processed)),
        standaloneName: schema.title,
        type: 'INTERSECTION'
      })
    case 'ANY':
      return set({ comment: schema.description, keyName, standaloneName: schema.title, type: 'ANY' })
    case 'ANY_OF':
      return set({
        comment: schema.description,
        keyName,
        params: schema.anyOf!.map(_ => parse(_, undefined, processed)),
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
          ast: parse(_, undefined, processed),
          keyName: schema.tsEnumNames![n]
        })),
        standaloneName: keyName!,
        type: 'ENUM'
      })
    case 'NAMED_SCHEMA':
      return set({
        comment: schema.description,
        keyName,
        params: parseSchemaSchema(schema as SchemaSchema, processed),
        standaloneName: computeSchemaName(schema as SchemaSchema, keyName),
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
          params: schema.items.map(_ => parse(_, undefined, processed)),
          standaloneName: schema.title,
          type: 'TUPLE'
        })
      } else {
        return set({
          comment: schema.description,
          keyName,
          params: parse(schema.items!, undefined, processed),
          standaloneName: schema.title,
          type: 'ARRAY'
        })
      }
    case 'UNION':
      return set({
        comment: schema.description,
        keyName,
        params: (schema.type as JSONSchema4TypeName[]).map(_ => parse({ required: [], type: _ }, undefined, processed)),
        standaloneName: schema.title,
        type: 'UNION'
      })
    case 'UNNAMED_ENUM':
      return set({
        comment: schema.description,
        keyName,
        params: schema.enum!.map(_ => parse(_, undefined, processed)),
        standaloneName: schema.title,
        type: 'UNION'
      })
    case 'UNNAMED_SCHEMA':
      return set({
        comment: schema.description,
        keyName,
        params: parseSchemaSchema(schema as SchemaSchema, processed),
        standaloneName: computeSchemaName(schema as SchemaSchema, keyName),
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
function computeSchemaName(
  schema: SchemaSchema,
  name?: string // name from schema's filename
): string {
  return schema.title || schema.id || name || 'Interface1' // TODO: increment interface number
}

/**
 * Helper to parse schema properties into params on the parent schema's type
 */
function parseSchemaSchema(
  schema: SchemaSchema,
  processed: Map<JSONSchema, AST>
): TInterfaceParam[] {

  const asts = map(schema.properties, (value, key: string) => ({
    ast: parse(value, key, processed),
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
        ast: parse(schema.additionalProperties, '[k: string]', processed),
        isRequired: true,
        keyName: '[k: string]'
      })
  }
}
