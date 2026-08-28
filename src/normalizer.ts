import {
  getRootSchema,
  JSONSchema,
  JSONSchemaTypeName,
  LinkedJSONSchema,
  NormalizedJSONSchema,
  Parent,
} from './types/JSONSchema'
import {appendToDescription, escapeBlockComment, isSchemaLike, justName, toSafeString, traverse} from './utils'
import {META_KEYWORDS} from './keywords'
import {Options} from './'
import {link} from './linker'
import {applySchemaTyping} from './applySchemaTyping'
import {DereferencedPaths} from './resolver'
import {isDeepStrictEqual} from 'util'

type Rule = (
  schema: LinkedJSONSchema,
  fileName: string,
  options: Options,
  key: string | null,
  dereferencedPaths: DereferencedPaths,
) => void
const rules = new Map<string, Rule>()

function hasType(schema: JSONSchema, type: JSONSchemaTypeName) {
  return schema.type === type || (Array.isArray(schema.type) && schema.type.includes(type))
}
function isObjectType(schema: LinkedJSONSchema) {
  return schema.properties !== undefined || hasType(schema, 'object') || hasType(schema, 'any')
}
function isArrayType(schema: LinkedJSONSchema) {
  return schema.items !== undefined || hasType(schema, 'array') || hasType(schema, 'any')
}
function isEnumTypeWithoutTsEnumNames(schema: LinkedJSONSchema) {
  return (
    schema.type === 'string' &&
    schema.enum !== undefined &&
    // A TypeScript enum member's value must be a string or a number, so only
    // string values can be turned into enum members. Mixed enums (`["a", null]`)
    // stay unions instead of becoming `null = null`, which does not compile.
    schema.enum.every(value => typeof value === 'string') &&
    schema.tsEnumNames === undefined
  )
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
  if (!isSchemaLike(schema)) {
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

rules.set('Add an $id to anything that needs it', (schema, fileName, _options, _key, dereferencedPaths) => {
  if (!isSchemaLike(schema)) {
    return
  }

  // Top-level schema
  if (!schema.$id && !schema[Parent]) {
    schema.$id = toSafeString(justName(fileName))
    return
  }

  // Sub-schemas with references
  if (!isArrayType(schema) && !isObjectType(schema)) {
    return
  }

  // We'll infer from $id and title downstream
  // TODO: Normalize upstream
  const dereferencedName = dereferencedPaths.get(schema)
  if (!schema.$id && !schema.title && dereferencedName) {
    schema.$id = toSafeString(justName(dereferencedName))
  }

  if (dereferencedName) {
    dereferencedPaths.delete(schema)
  }
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
  if (maxItems === undefined) {
    return
  }
  // A tuple isn't expanded in isolation: it's expanded once for every combination of
  // its enclosing bounded arrays, so nested bounded arrays multiply together (an array
  // of N arrays of M items can emit up to N*M item combinations). Fold in that
  // multiplier so we don't only catch schemas that are too big on their own while
  // missing ones that are only too big once nested. Ancestors are already normalized
  // by the time we get here, since rules traverse parent-first.
  let ancestorMultiplier = 1
  let child: LinkedJSONSchema = schema
  let parent = schema[Parent]
  while (parent && isArrayType(parent) && parent.items === child) {
    const {maxItems: parentMaxItems, minItems: parentMinItems} = parent
    ancestorMultiplier *= typeof parentMaxItems === 'number' ? parentMaxItems : (parentMinItems as number) || 1
    child = parent
    parent = parent[Parent]
  }
  if ((maxItems - (minItems as number)) * ancestorMultiplier > options.maxItems) {
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

// Schemas that were rewritten by the rule below, so that the `tsEnumNames`
// inference rule can tell them apart from hand-written enums.
const schemasNormalizedFromConst = new WeakSet<LinkedJSONSchema>()

rules.set('Transform const to singleton enum', schema => {
  if (schema.const !== undefined) {
    schema.enum = [schema.const]
    schemasNormalizedFromConst.add(schema)
    delete schema.const
  }
})

rules.set('Add tsEnumNames to enum types', (schema, _, options) => {
  if (
    isEnumTypeWithoutTsEnumNames(schema) &&
    options.inferStringEnumKeysFromValues &&
    !schemasNormalizedFromConst.has(schema)
  ) {
    schema.tsEnumNames = schema.enum?.map(String)
  }
})

/**
 * OpenAPI 3.0 `nullable: true` becomes `anyOf: [<schema>, {type: 'null'}]`, which the
 * parser already turns into `X | null` for every shape of schema (typed or untyped,
 * enum, const, allOf, array...). Keywords that describe the property or definition rather
 * than its values (or that host other schemas) stay on the outer schema. Schemas whose
 * `type` or `enum` already allow null, and schemas that constrain nothing (only such
 * keywords next to `nullable`), are left as they are. The schema is rewritten in place,
 * so every reference to it sees the union.
 *
 * A TypeScript enum (`enum` + `tsEnumNames`) cannot be an anonymous union member, so it
 * takes its `title` with it, or else is named after `enumName` (the key or definition it
 * sits under) - the name the parser would have given it in place.
 *
 * Returns the schema that moved into the `anyOf`, if any.
 */
function normalizeNullable(schema: JSONSchema, enumName?: string): JSONSchema | undefined {
  if (schema.nullable !== true || Object.keys(schema).every(_ => _ === 'nullable' || META_KEYWORDS.has(_))) {
    return
  }
  delete schema.nullable
  if (hasType(schema, 'null') || (Array.isArray(schema.enum) && schema.enum.includes(null))) {
    return
  }
  const isNamedEnum = 'enum' in schema && 'tsEnumNames' in schema
  const inner: JSONSchema = {}
  for (const key of Object.keys(schema)) {
    if (!META_KEYWORDS.has(key) || (isNamedEnum && key === 'title')) {
      inner[key] = schema[key]
      delete schema[key]
    }
  }
  if (isNamedEnum && !inner.title && enumName) {
    inner.$id = enumName
  }
  schema.anyOf = [inner, {type: 'null'}]
  return inner
}

// Runs this late so that the schema has already been named from its `$ref` path, had
// its object defaults filled in, its `const` turned into an `enum` and its `tsEnumNames`
// inferred (all of which look at keywords that move into the `anyOf`), and before types
// are pre-calculated.
rules.set('Transform `nullable` to anyOf with null', (schema, _, _options, key, dereferencedPaths) => {
  // The name a TypeScript enum gets in this position: the definition it was dereferenced
  // from, else the key it sits under (unless that is just an index into anyOf/items)
  const dereferencedName = dereferencedPaths.get(schema)
  const enumName = dereferencedName ? justName(dereferencedName) : key && isNaN(+key) ? key : undefined
  const inner = normalizeNullable(schema, enumName)
  if (!inner) {
    return
  }
  link(schema.anyOf!, schema)
  // A nullable enum that is itself a definition keeps the definition's name (and so its
  // `enum` declaration); references to it become `Name | null`
  if ('tsEnumNames' in inner) {
    const $defs = getRootSchema(schema as NormalizedJSONSchema).$defs ?? {}
    for (const name of Object.keys($defs)) {
      if ($defs[name] === schema) {
        $defs[name] = inner as NormalizedJSONSchema
      }
    }
  }
})

/**
 * `nullable` next to a `$ref` has to be rewritten before dereferencing, while it still
 * visibly belongs to the referencing schema: the ref parser folds `$ref` siblings into a
 * copy of the target, where it would read as if the target itself were nullable (and
 * the copy would be emitted as a second, identical type). Everything else waits for the
 * rule above, which also reaches schemas in other files, once dereferencing has pulled
 * them in.
 */
export function normalizeNullableRefs(schema: JSONSchema): void {
  traverse(schema as LinkedJSONSchema, node => {
    if (node.$ref) {
      normalizeNullable(node)
    }
  })
}

// Precalculation of the schema types is necessary because the ALL_OF type
// is implemented in a way that mutates the schema object. Detection of the
// NAMED_SCHEMA type relies on the presence of the $id property, which is
// hoisted to a parent schema object during the ALL_OF type implementation,
// and becomes unavailable if the same schema is used in multiple places.
//
// Precalculation of the `ALL_OF` intersection schema is necessary because
// the intersection schema needs to participate in the schema cache during
// the parsing step, so it cannot be re-calculated every time the schema
// is encountered.
rules.set('Pre-calculate schema types and intersections', schema => {
  if (schema !== null && typeof schema === 'object') {
    applySchemaTyping(schema)
  }
})

export function normalize(
  rootSchema: LinkedJSONSchema,
  dereferencedPaths: DereferencedPaths,
  filename: string,
  options: Options,
): NormalizedJSONSchema {
  rules.forEach(rule => traverse(rootSchema, (schema, key) => rule(schema, filename, options, key, dereferencedPaths)))
  return rootSchema as NormalizedJSONSchema
}
