import {
  JSONSchemaTypeName,
  AnnotatedJSONSchema,
  NormalizedJSONSchema,
  JSONSchema,
  Parent,
  Ref,
  IsSchema,
} from './types/JSONSchema'
import {appendToDescription, escapeBlockComment, justName, toSafeString, traverse} from './utils'
import {Options} from './'
import {isDeepStrictEqual} from 'util'
import {typesOfSchema} from './typesOfSchema'

type Rule = (schema: AnnotatedJSONSchema, fileName: string, options: Options, key: string | null) => void
const rules = new Map<string, Rule>()

function hasType(schema: JSONSchema, type: JSONSchemaTypeName) {
  return schema.type === type || (Array.isArray(schema.type) && schema.type.includes(type))
}
function isObjectType(schema: JSONSchema) {
  return schema.properties !== undefined || hasType(schema, 'object') || hasType(schema, 'any')
}
function isArrayType(schema: JSONSchema) {
  return schema.items !== undefined || hasType(schema, 'array') || hasType(schema, 'any')
}
function isEnumTypeWithoutTsEnumNames(schema: JSONSchema) {
  return schema.type === 'string' && schema.enum !== undefined && schema.tsEnumNames === undefined
}

rules.set('Remove `type=["null"]` if `enum=[null]`', schema => {
  if (
    Array.isArray(schema.enum) &&
    schema.enum.some(e => e === null) &&
    Array.isArray(schema.type) &&
    schema.type.includes('null')
  ) {
    schema.type = schema.type.filter(type => type !== 'null')
  }
})

rules.set('Destructure unary types', schema => {
  if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
    schema.type = schema.type[0]
  }
})

rules.set('Add empty `required` property if none is defined', schema => {
  if (isObjectType(schema) && !('required' in schema)) {
    schema.required = []
  }
})

rules.set('Transform `required`=false to `required`=[]', schema => {
  if (schema.required === false) {
    schema.required = []
  }
})

rules.set('Default additionalProperties', (schema, _, options) => {
  if (isObjectType(schema) && !('additionalProperties' in schema) && schema.patternProperties === undefined) {
    schema.additionalProperties = options.additionalProperties
  }
})

rules.set('Transform id to $id', (schema, fileName) => {
  if (!schema[IsSchema]) {
    return
  }

  if (schema.id && schema.$id && schema.id !== schema.$id) {
    throw ReferenceError(
      `Schema must define either id or $id, not both. Given id=${schema.id}, $id=${schema.$id} in ${fileName}`,
    )
  }
  if (schema.id) {
    schema.$id = schema.id
    delete schema.id
  }
})

rules.set('Add an $id to each top-level schema', (schema, fileName) => {
  if (schema.$id || schema[Parent]) {
    return
  }

  if (!schema[IsSchema]) {
    return
  }

  schema.$id = toSafeString(justName(fileName))
})

rules.set('Add an $id to each referenced schema', schema => {
  if (schema.$id) {
    return
  }

  if (!schema[Ref]) {
    return
  }

  schema.$id = toSafeString(justName(schema[Ref]))
})

rules.set('Escape closing JSDoc comment', schema => {
  escapeBlockComment(schema)
})

rules.set('Add JSDoc comments for minItems and maxItems', schema => {
  if (!isArrayType(schema)) {
    return
  }
  const commentsToAppend = [
    'minItems' in schema ? `@minItems ${schema.minItems}` : '',
    'maxItems' in schema ? `@maxItems ${schema.maxItems}` : '',
  ].filter(Boolean)
  if (commentsToAppend.length) {
    schema.description = appendToDescription(schema.description, ...commentsToAppend)
  }
})

rules.set('Optionally remove maxItems and minItems', (schema, _fileName, options) => {
  if (!isArrayType(schema)) {
    return
  }
  if ('minItems' in schema && options.ignoreMinAndMaxItems) {
    delete schema.minItems
  }
  if ('maxItems' in schema && (options.ignoreMinAndMaxItems || options.maxItems === -1)) {
    delete schema.maxItems
  }
})

rules.set('Normalize schema.minItems', (schema, _fileName, options) => {
  if (options.ignoreMinAndMaxItems) {
    return
  }
  // make sure we only add the props onto array types
  if (!isArrayType(schema)) {
    return
  }
  const {minItems} = schema
  schema.minItems = typeof minItems === 'number' ? minItems : 0
  // cannot normalize maxItems because maxItems = 0 has an actual meaning
})

rules.set('Remove maxItems if it is big enough to likely cause OOMs', (schema, _fileName, options) => {
  if (options.ignoreMinAndMaxItems || options.maxItems === -1) {
    return
  }
  if (!isArrayType(schema)) {
    return
  }
  const {maxItems, minItems} = schema
  // minItems is guaranteed to be a number after the previous rule runs
  if (maxItems !== undefined && maxItems - (minItems as number) > options.maxItems) {
    delete schema.maxItems
  }
})

rules.set('Normalize schema.items', (schema, _fileName, options) => {
  if (options.ignoreMinAndMaxItems) {
    return
  }
  const {maxItems, minItems} = schema
  const hasMaxItems = typeof maxItems === 'number' && maxItems >= 0
  const hasMinItems = typeof minItems === 'number' && minItems > 0

  if (schema.items && !Array.isArray(schema.items) && (hasMaxItems || hasMinItems)) {
    const items = schema.items
    // create a tuple of length N
    const newItems = Array(maxItems || minItems || 0).fill(items)
    if (!hasMaxItems) {
      // if there is no maximum, then add a spread item to collect the rest
      schema.additionalItems = items
    }
    schema.items = newItems
  }

  if (Array.isArray(schema.items) && hasMaxItems && maxItems! < schema.items.length) {
    // it's perfectly valid to provide 5 item defs but require maxItems 1
    // obviously we shouldn't emit a type for items that aren't expected
    schema.items = schema.items.slice(0, maxItems)
  }

  return schema
})

rules.set('Remove extends, if it is empty', schema => {
  if (!schema.hasOwnProperty('extends')) {
    return
  }
  if (schema.extends == null || (Array.isArray(schema.extends) && schema.extends.length === 0)) {
    delete schema.extends
  }
})

rules.set('Make extends always an array, if it is defined', schema => {
  if (schema.extends == null) {
    return
  }
  if (!Array.isArray(schema.extends)) {
    schema.extends = [schema.extends]
  }
})

rules.set('Transform definitions to $defs', (schema, fileName) => {
  if (schema.definitions && schema.$defs && !isDeepStrictEqual(schema.definitions, schema.$defs)) {
    throw ReferenceError(
      `Schema must define either definitions or $defs, not both. Given id=${schema.id} in ${fileName}`,
    )
  }
  if (schema.definitions) {
    schema.$defs = schema.definitions
    delete schema.definitions
  }
})

rules.set(
  "Add an $id to each $def that doesn't have one, if unreachableDefinitions is enabled",
  (schema, _, options) => {
    if (!options.unreachableDefinitions) {
      return
    }

    if (schema.$id) {
      return
    }

    const parent = schema[Parent]
    if (!parent) {
      return
    }

    const grandparent = parent[Parent]
    if (!grandparent) {
      return
    }

    if (Object.keys(grandparent).find(_ => grandparent[_] === parent) !== '$defs') {
      return
    }

    schema.$id = toSafeString(Object.keys(parent).find(_ => parent[_] === schema)!)
  },
)

rules.set('Transform const to singleton enum', schema => {
  if (schema.const !== undefined) {
    schema.enum = [schema.const]
    delete schema.const
  }
})

rules.set('Add tsEnumNames to enum types', (schema, _, options) => {
  if (isEnumTypeWithoutTsEnumNames(schema) && options.inferStringEnumKeysFromValues) {
    schema.tsEnumNames = schema.enum?.map(String)
  }
})

rules.set('Add an $id to each named enum', schema => {
  if (!schema[IsSchema]) {
    return
  }

  if (schema.$id) {
    return
  }

  if (!typesOfSchema(schema).includes('NAMED_ENUM')) {
    return
  }

  const parent = schema[Parent]
  const keyName = Object.keys(parent).find(_ => parent[_] === schema)

  // Special case: generate nicer names for additionalProperties enums
  if (parent[IsSchema] && keyName === 'additionalProperties') {
    const grandparent = parent[Parent]
    const parentKeyName = Object.keys(grandparent).find(_ => grandparent[_] === parent)!
    schema.$id = toSafeString(parentKeyName) + toSafeString(keyName)
    return
  }

  schema.$id = toSafeString(justName(keyName))
})

export function normalize(rootSchema: AnnotatedJSONSchema, filename: string, options: Options): NormalizedJSONSchema {
  rules.forEach(rule => traverse(rootSchema, (schema, key) => rule(schema, filename, options, key)))
  return rootSchema as NormalizedJSONSchema
}
