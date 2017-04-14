import { map } from 'lodash'
import { typeOfSchema } from './typeOfSchema'
import { AST, T_ANY, T_ANY_ADDITIONAL_PROPERTIES, TEnum, TInterface, ASTWithName } from './types/AST'
import { NormalizedJSONSchema, SchemaSchema, SimpleType } from './types/JSONSchema'

export function parse(
  schema: NormalizedJSONSchema,
  name?: string,
  rootSchema: NormalizedJSONSchema = schema,
  isRequired = false
): AST {
  switch (typeOfSchema(schema)) {
    case 'ALL_OF':
      // TODO: support schema.properties
      return { comment: schema.description, name, isRequired, params: schema.allOf!.map(_ => parse(_)), type: 'INTERSECTION' }
    case 'ANY':
      return { comment: schema.description, name, isRequired, type: 'ANY' }
    case 'ANY_OF':
      return { comment: schema.description, name, isRequired, params: schema.anyOf!.map(_ => parse(_)), type: 'UNION' }
    case 'BOOLEAN':
      return { comment: schema.description, name, isRequired, type: 'BOOLEAN' }
    case 'LITERAL':
      return { isRequired, name, params: schema, type: 'LITERAL' }
    case 'NAMED_ENUM':
      return { comment: schema.description, name: name!, isRequired,
        params: schema.enum!.map((_, n) => parse(_, schema.tsEnumNames![n], rootSchema) as ASTWithName),
        type: 'ENUM'
      }
    case 'NAMED_SCHEMA':
      return { comment: schema.description, name: computeSchemaName(schema as SchemaSchema, name), isRequired, params: parseSchemaSchema(schema as SchemaSchema, rootSchema), type: 'INTERFACE' } as TInterface
    case 'NULL':
      return { comment: schema.description, name, isRequired, type: 'NULL' }
    case 'NUMBER':
      return { comment: schema.description, name, isRequired, type: 'NUMBER' }
    case 'OBJECT':
      return { comment: schema.description, name, isRequired, type: 'OBJECT' }
    case 'REFERENCE':
      return parse(resolveReference(schema.$ref as string, rootSchema), '', schema)
    case 'STRING':
      return { comment: schema.description, name, isRequired, type: 'STRING' }
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        return { comment: schema.description, name, isRequired, params: schema.items.map(_ => parse(_)), type: 'TUPLE' }
      } else {
        return { comment: schema.description, name, isRequired, params: parse(schema.items!), type: 'ARRAY' }
      }
    case 'UNION':
      return { comment: schema.description, name, isRequired, params: (schema.type as SimpleType[]).map(_ => parse({ additionalProperties: true, required: [], type: _})), type: 'UNION' }
    case 'UNNAMED_ENUM':
      return { comment: schema.description, name, isRequired, params: schema.enum!.map(_ => parse(_)), type: 'UNION' }
    case 'UNNAMED_SCHEMA':
      return { comment: schema.description, name: 'Foo', isRequired, params: parseSchemaSchema(schema as SchemaSchema, rootSchema), type: 'INTERFACE' }
    case 'UNTYPED_ARRAY':
      return { comment: schema.description, name, isRequired, params: T_ANY, type: 'ARRAY' }
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
  rootSchema: NormalizedJSONSchema
): ASTWithName[] {
  const asts = map(schema.properties, (value, key) =>
    parse(value, key, rootSchema, schema.required.includes(key!)) as ASTWithName
  )
  // handle additionalProperties
  switch (schema.additionalProperties) {
    case true: return asts.concat(T_ANY_ADDITIONAL_PROPERTIES)
    case false: return asts

    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default: return asts.concat(parse(schema.additionalProperties as NormalizedJSONSchema, '[k: string]', rootSchema, true) as ASTWithName)
  }
}

function resolveReference(
  $ref: string,
  rootSchema: NormalizedJSONSchema
  // definitions: Map<string, TEnum | TInterface>,
  // context: AST[]
): NormalizedJSONSchema {
  const [schemaId, path] = $ref.split('#')
  const schema = schemaId === rootSchema.id
    ? rootSchema
    : resolveSchema(schemaId)

  console.log('schema', schema)
  return resolvePath(schema, path.split('/').slice(1))
}

function resolvePath(schema: NormalizedJSONSchema, path: string[]): NormalizedJSONSchema {
  switch (path.length) {
    case 0: return schema
    default:

      // TODO: move to validator
      if (!(path[0] in schema)) {
        throw new ReferenceError(`Referenced path "${path.join('/')}" does not exist in schema`)
      }

      return resolvePath(schema[path[0]], path.slice(1))
  }
}

// TODO
// TODO: use BigstickCarpet/json-schema-ref-parser
// function resolveSchema(schemaId: string): Promise<JSONSchema> {
//   if (schemaId.startsWith('http://') || schemaId.startsWith('https://')) {
//     throw new ReferenceError(`Error resolving schema "${schemaId}" - HTTP schemas are not yet supported!`)
//   }

//   if (schemaId) {
//     throw new ReferenceError(`Error resolving schema "${schemaId}" - external file schemas are not yet supported!`)
//   }
// }

// function resolveExistingReference(
//   $ref: string,
//   definitions: Map<string, TEnum | TInterface>
// ): JSONSchema {
//   // definitions.
// }
