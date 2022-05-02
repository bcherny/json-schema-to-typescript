import {JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {findKey, includes, isPlainObject, map, memoize, omit} from 'lodash'
import {format} from 'util'
import {Options} from './'
import {typesOfSchema} from './typesOfSchema'
import {
  AST,
  T_ANY,
  T_ANY_ADDITIONAL_PROPERTIES,
  TInterface,
  TInterfaceParam,
  TNamedInterface,
  TTuple,
  T_UNKNOWN,
  T_UNKNOWN_ADDITIONAL_PROPERTIES,
  TIntersection,
  ASTWithoutHashcode
} from './types/AST'
import {
  getRootSchema,
  isPrimitive,
  JSONSchema as LinkedJSONSchema,
  JSONSchemaWithDefinitions,
  SchemaSchema,
  SchemaType
} from './types/JSONSchema'
import {generateName, log, maybeStripDefault, maybeStripNameHints} from './utils'
import {hash} from './hasher'

export type Processed = Map<LinkedJSONSchema, Map<SchemaType, AST>>

export type UsedNames = Set<string>

export function parse(
  schema: LinkedJSONSchema | JSONSchema4Type,
  options: Options,
  keyName?: string,
  processed: Processed = new Map(),
  usedNames = new Set<string>()
): AST {
  if (isPrimitive(schema)) {
    return parseLiteral(schema, keyName)
  }

  const types = typesOfSchema(schema)
  if (types.length === 1) {
    const ast = parseAsTypeWithCache(schema, types[0], options, keyName, processed, usedNames)
    log('blue', 'parser', 'Types:', types, 'Input:', schema, 'Output:', ast)
    return ast
  }

  // Be careful to first process the intersection before processing its params,
  // so that it gets first pick for standalone name.
  const ast = (parseAsTypeWithCache(
    {
      allOf: [],
      description: schema.description,
      id: schema.id,
      title: schema.title
    },
    'ALL_OF',
    options,
    keyName,
    processed,
    usedNames
  ) as TIntersection) as any // TODO

  ast.params = types.map(type =>
    // We hoist description (for comment) and id/title (for standaloneName)
    // to the parent intersection type, so we remove it from the children.
    parseAsTypeWithCache(maybeStripNameHints(schema), type, options, keyName, processed, usedNames)
  )

  log('blue', 'parser', 'Types:', types, 'Input:', schema, 'Output:', ast)
  return ast
}

function parseAsTypeWithCache(
  schema: LinkedJSONSchema,
  type: SchemaType,
  options: Options,
  keyName?: string,
  processed: Processed = new Map(),
  usedNames = new Set<string>()
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

function parseLiteral(schema: JSONSchema4Type, keyName: string | undefined): AST {
  return {
    hashCode: `LITERAL(${schema})`,
    keyName,
    params: schema,
    type: 'LITERAL'
  }
}

function withHash<A extends ASTWithoutHashcode>(ast: A, options: Options): A & {hashCode: string} {
  return {
    ...ast,
    // TODO
    hashCode: `${ast.type}${hash((ast as any) as AST, options)}${ast.comment ? `#${ast.comment}` : ''}`
  }
}

function parseNonLiteral(
  schema: LinkedJSONSchema,
  type: SchemaType,
  options: Options,
  keyName: string | undefined,
  processed: Processed,
  usedNames: UsedNames
): AST {
  const definitions = getDefinitionsMemoized(getRootSchema(schema as any)) // TODO
  const keyNameFromDefinition = findKey(definitions, _ => _ === schema)

  switch (type) {
    case 'ALL_OF': {
      const name = standaloneName(schema, keyNameFromDefinition, usedNames)
      const params = schema.allOf!.map(_ => parse(_, options, undefined, processed, usedNames))
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: name,
          params,
          type: 'INTERSECTION'
        },
        options
      )
    }
    case 'ANY': {
      const name = standaloneName(schema, keyNameFromDefinition, usedNames)
      return withHash(
        {
          ...(options.unknownAny ? T_UNKNOWN : T_ANY),
          comment: schema.description,
          keyName,
          standaloneName: name
        },
        options
      )
    }
    case 'ANY_OF': {
      const name = standaloneName(schema, keyNameFromDefinition, usedNames)
      const params = schema.anyOf!.map(_ => parse(_, options, undefined, processed, usedNames))
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: name,
          params,
          type: 'UNION'
        },
        options
      )
    }
    case 'BOOLEAN': {
      const name = standaloneName(schema, keyNameFromDefinition, usedNames)
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: name,
          type: 'BOOLEAN'
        },
        options
      )
    }
    case 'CUSTOM_TYPE': {
      const name = standaloneName(schema, keyNameFromDefinition, usedNames)
      return withHash(
        {
          comment: schema.description,
          keyName,
          params: schema.tsType!,
          standaloneName: name,
          type: 'CUSTOM_TYPE'
        },
        options
      )
    }
    case 'NAMED_ENUM': {
      const name = standaloneName(schema, keyNameFromDefinition ?? keyName, usedNames)!
      const params = schema.enum!.map((_, n) => ({
        ast: parse(_, options, undefined, processed, usedNames),
        keyName: schema.tsEnumNames![n]
      }))
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: name,
          params,
          type: 'ENUM'
        },
        options
      )
    }
    case 'NAMED_SCHEMA':
      return newInterface(schema as SchemaSchema, options, processed, usedNames, keyName)
    case 'NULL':
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'NULL'
        },
        options
      )
    case 'NUMBER':
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'NUMBER'
        },
        options
      )
    case 'OBJECT':
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'OBJECT'
        },
        options
      )
    case 'ONE_OF': {
      const params = schema.oneOf!.map(_ => parse(_, options, undefined, processed, usedNames))
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          params,
          type: 'UNION'
        },
        options
      )
    }
    case 'REFERENCE':
      throw Error(format('Refs should have been resolved by the resolver!', schema))
    case 'STRING':
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'STRING'
        },
        options
      )
    case 'TYPED_ARRAY':
      if (Array.isArray(schema.items)) {
        // normalised to not be undefined
        const minItems = schema.minItems!
        const maxItems = schema.maxItems!
        const params = schema.items.map(_ => parse(_, options, undefined, processed, usedNames))
        const arrayType = (withHash(
          {
            comment: schema.description,
            keyName,
            maxItems,
            minItems,
            standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
            params,
            type: 'TUPLE'
          },
          options
        ) as TTuple) as any // todo
        if (schema.additionalItems === true) {
          arrayType.spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY
        } else if (schema.additionalItems) {
          arrayType.spreadParam = parse(schema.additionalItems, options, undefined, processed, usedNames)
        }
        return arrayType
      } else {
        const params = parse(schema.items!, options, undefined, processed, usedNames)
        return withHash(
          {
            comment: schema.description,
            keyName,
            standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
            params,
            type: 'ARRAY'
          },
          options
        )
      }
    case 'UNION': {
      const params = (schema.type as JSONSchema4TypeName[]).map(type => {
        const member: LinkedJSONSchema = {...omit(schema, 'description', 'id', 'title'), type}
        return parse(maybeStripDefault(member as any), options, undefined, processed, usedNames)
      })
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          params,
          type: 'UNION'
        },
        options
      )
    }
    case 'UNNAMED_ENUM': {
      const params = schema.enum!.map(_ => parse(_, options, undefined, processed, usedNames))
      return withHash(
        {
          comment: schema.description,
          keyName,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          params,
          type: 'UNION'
        },
        options
      )
    }
    case 'UNNAMED_SCHEMA':
      return withHash(
        newInterface(schema as SchemaSchema, options, processed, usedNames, keyName, keyNameFromDefinition),
        options
      )
    case 'UNTYPED_ARRAY': {
      // normalised to not be undefined
      const minItems = schema.minItems!
      const maxItems = typeof schema.maxItems === 'number' ? schema.maxItems : -1
      const paramsType = withHash(options.unknownAny ? T_UNKNOWN : T_ANY, options)
      const params = Array<AST>(Math.max(maxItems, minItems) || 0).fill(paramsType)
      if (minItems > 0 || maxItems >= 0) {
        return withHash(
          {
            comment: schema.description,
            keyName,
            maxItems: schema.maxItems,
            minItems,
            // create a tuple of length N
            params,
            // if there is no maximum, then add a spread item to collect the rest
            spreadParam: maxItems >= 0 ? undefined : paramsType,
            standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
            type: 'TUPLE'
          },
          options
        )
      }

      return withHash(
        {
          comment: schema.description,
          keyName,
          params: paramsType,
          standaloneName: standaloneName(schema, keyNameFromDefinition, usedNames),
          type: 'ARRAY'
        },
        options
      )
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
  processed: Processed,
  usedNames: UsedNames,
  keyName?: string,
  keyNameFromDefinition?: string
): TInterface {
  const name = standaloneName(schema, keyNameFromDefinition, usedNames)!
  const params = parseSchema(schema, options, processed, usedNames, name)
  const superTypes = parseSuperTypes(schema, options, processed, usedNames)
  return withHash(
    {
      comment: schema.description,
      keyName,
      params,
      standaloneName: name,
      superTypes,
      type: 'INTERFACE'
    },
    options
  )
}

function parseSuperTypes(
  schema: SchemaSchema,
  options: Options,
  processed: Processed,
  usedNames: UsedNames
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
  parentSchemaName: string
): TInterfaceParam[] {
  let asts: TInterfaceParam[] = map(schema.properties, (value, key: string) =>
    withHash(
      {
        ast: parse(value, options, key, processed, usedNames),
        isPatternProperty: false,
        isRequired: includes(schema.required || [], key),
        isUnreachableDefinition: false,
        keyName: key,
        type: 'INTERFACE_PARAM',
        comment: undefined,
        standaloneName: undefined
      },
      options
    )
  )

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
via the \`patternProperty\` "${key}".`
        ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
        return withHash(
          {
            ast,
            isPatternProperty: !singlePatternProperty,
            isRequired: singlePatternProperty || includes(schema.required || [], key),
            isUnreachableDefinition: false,
            keyName: singlePatternProperty ? '[k: string]' : key,
            type: 'INTERFACE_PARAM',
            comment: undefined,
            standaloneName: undefined
          },
          options
        )
      })
    )
  }

  if (options.unreachableDefinitions) {
    asts = asts.concat(
      map(schema.definitions, (value, key: string) => {
        const ast = parse(value, options, key, processed, usedNames)
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema
via the \`definition\` "${key}".`
        ast.comment = ast.comment ? `${ast.comment}\n\n${comment}` : comment
        return withHash(
          {
            ast,
            isPatternProperty: false,
            isRequired: includes(schema.required || [], key),
            isUnreachableDefinition: true,
            keyName: key,
            type: 'INTERFACE_PARAM',
            comment: undefined,
            standaloneName: undefined
          },
          options
        )
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
        keyName: '[k: string]',
        type: 'INTERFACE_PARAM',
        comment: undefined,
        standaloneName: undefined
      } as any) // todo

    case false:
      return asts

    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default:
      return asts.concat({
        ast: parse(schema.additionalProperties, options, '[k: string]', processed, usedNames),
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: '[k: string]'
      } as any) // todo
  }
}

type Definitions = {[k: string]: LinkedJSONSchema}

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

const getDefinitionsMemoized = memoize(getDefinitions)

/**
 * TODO: Reduce rate of false positives
 */
function hasDefinitions(schema: LinkedJSONSchema): schema is JSONSchemaWithDefinitions {
  return 'definitions' in schema
}
