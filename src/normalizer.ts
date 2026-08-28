import {getRootSchema, LinkedJSONSchema, NormalizedJSONSchema, Parent} from './types/JSONSchema'
import {
  appendToDescription,
  escapeBlockComment,
  formatTypeOf,
  hasType,
  isSchemaLike,
  justName,
  toSafeString,
  traverse,
} from './utils'
import {normalizeNullable} from './prenormalizer'
import {Options} from './'
import {link} from './linker'
import {applySchemaTyping, hasOwnType, isShapeless} from './typesOfSchema'
import {DereferencedPaths} from './resolver'
import {isDeepStrictEqual} from 'util'

type Rule = (
  schema: LinkedJSONSchema,
  fileName: string,
  options: Options,
  key: string | null,
  dereferencedPaths: DereferencedPaths,
) => void

// Rules run in the order they are set: each rule sees a schema only after every rule before it
// has run on that schema and on the schemas above it. That is all most rules need, so
// consecutive rules share one walk over the schema (walking a large dereferenced schema costs
// far more than any rule does). A rule gets a walk of its own -- `startNewPass()` above it --
// when sharing one would be observable: it reads or compares schemas other than the one it is
// given and its ancestors (so the rules before it must have finished everywhere), it adds
// schemas that the rules before it never saw, or it removes or moves a key that `traverse`
// descends through (`traverse` follows every key not on its blacklist, `const` and `extends`
// included, and visits an `allOf` moved into the intersection last), which would change what
// the rules sharing its walk visit and in which order.
const passes: Rule[][] = [[]]
const rules = {
  set(_name: string, rule: Rule) {
    passes[passes.length - 1].push(rule)
  },
}
function startNewPass() {
  passes.push([])
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

// Left alone, an untyped member falls through to the generic `UNNAMED_SCHEMA` default
// (an open object) instead of picking up the `type` its parent already declared. Runs
// this early so that the rules below normalize an inherited `array` like a declared one.
rules.set(
  'Inherit parent `type` into untyped `anyOf`/`oneOf` members',
  (schema, _, _options, _key, dereferencedPaths) => {
    const {type} = schema
    // An untyped member already parses as an open object, so an `object` parent has
    // nothing to add (and its required-only members are the parser's to narrow).
    if (typeof type !== 'string' || type === 'object') {
      return
    }
    const inherit = (members: LinkedJSONSchema[] | undefined) =>
      members?.forEach((member, i) => {
        // `anyOf`/`oneOf` members are typed as `LinkedJSONSchema`, but a boolean
        // schema (`true`/`false`) can still show up here at runtime.
        if (typeof member !== 'object' || !member) {
          return
        }
        // A member that was a `$ref` is now the shared definition object itself: leave it
        // alone so the definition keeps its name and type. Any other member is replaced by a
        // typed COPY rather than written to, so an object shared by other means (YAML
        // anchors, programmatic callers) is not retyped everywhere else it appears.
        if (!hasOwnType(member) && !dereferencedPaths.has(member)) {
          members[i] = link({...member, type}, members)
        }
      })
    inherit(schema.anyOf)
    inherit(schema.oneOf)
  },
)

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

// `unevaluatedProperties` (draft 2019-09+) constrains the keys no other keyword
// accounted for. Where a schema declares its properties inline, that is the same set
// `additionalProperties` covers, so fold it into the handling we already have rather
// than teaching the parser a second way to say the same thing. An explicit
// `additionalProperties` is the narrower constraint, so it wins.
rules.set('Treat `unevaluatedProperties` as `additionalProperties`', schema => {
  // `traverse` also visits boolean schemas, where `in` would throw.
  if (typeof schema !== 'object' || schema === null || schema.unevaluatedProperties === undefined) {
    return
  }
  if (schema.additionalProperties === undefined) {
    schema.additionalProperties = schema.unevaluatedProperties
  }
  delete schema.unevaluatedProperties
})

// Draft 2020-12 renamed the tuple form of `items` to `prefixItems`, and `additionalItems` to
// `items`. No earlier draft has `prefixItems`, so its presence alone says which meaning a
// sibling `items` carries (2020-12 core, section 10.3.1.2: "When "prefixItems" is present, the
// behavior of "items" is identical to the former "additionalItems" keyword"). Runs before any
// rule that asks `isArrayType`, which looks for `items`. An array-form `items` next to
// `prefixItems` mixes two drafts: that schema is left as it is.
rules.set('Treat `prefixItems` as the tuple form of `items`', schema => {
  if (!Array.isArray(schema.prefixItems) || Array.isArray(schema.items)) {
    return
  }
  if (schema.items !== undefined) {
    schema.additionalItems = schema.items
  }
  schema.items = schema.prefixItems
  delete schema.prefixItems
})

rules.set('Default additionalProperties', (schema, _, options) => {
  if (isObjectType(schema) && !('additionalProperties' in schema) && schema.patternProperties === undefined) {
    schema.additionalProperties = options.additionalProperties
  }
})

// Drafts 4 through 2019-09: an absent `additionalItems` is the empty schema, so a tuple (the
// array form of `items`) allows further items of any type. Next to a single `items` schema the
// keyword means nothing; `Normalize schema.items` sets it itself on the tuples it builds.
rules.set('Default additionalItems', schema => {
  if (Array.isArray(schema.items) && schema.additionalItems === undefined) {
    schema.additionalItems = true
  }
})

rules.set('Mark every property required when `minProperties` covers them all', schema => {
  const {minProperties, properties} = schema
  if (
    typeof minProperties !== 'number' ||
    // Anything that lets the object carry keys beyond `properties` breaks the
    // counting argument below, since `minProperties` could be satisfied by those.
    schema.additionalProperties !== false ||
    schema.patternProperties !== undefined ||
    properties === undefined
  ) {
    return
  }
  const propertyNames = Object.keys(properties)
  if (propertyNames.length === 0 || minProperties < propertyNames.length) {
    return
  }
  // No other key can appear, so the object holds at most these properties. Needing
  // at least this many of them means every one of them has to be present.
  schema.required = propertyNames
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
  // `tsType` (see typesOfSchema.ts) supersedes the schema's own shape, so naming this
  // schema after the $ref path it was dereferenced from is misleading here: when `$ref`
  // has sibling keywords, the ref-resolution library merges the referenced schema into a
  // new object (not the definitions entry it looks like it came from) before this rule
  // runs, so the derived $id collides with -- or stands in for -- the real definition's
  // own name instead of being treated as the opaque, unnamed override `tsType` calls for.
  if (!schema.$id && !schema.title && !schema.tsType && dereferencedName) {
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

// The rule above compares each ancestor's `items` with the schema below it, so it has to have
// run everywhere before this one rewrites any `items` into a tuple
startNewPass()

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
    schema.items = Array(maxItems || minItems || 0).fill(items)
    // if there is no maximum, then add a spread item to collect the rest
    schema.additionalItems = hasMaxItems ? false : items
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

// Wrapping `extends` in an array makes the walk descend into the wrapped schema, which the
// rules above never visited on its own
startNewPass()

rules.set('Make extends always an array, if it is defined', schema => {
  if (schema.extends == null) {
    return
  }
  if (!Array.isArray(schema.extends)) {
    schema.extends = [schema.extends]
  }
})

rules.set('Remove the schema itself from its `allOf`', schema => {
  // A schema listed in its own `allOf` (`{$ref: '#'}` at the root, a definition that
  // `$ref`s itself, ...) asks that whatever this schema accepts also be accepted by this
  // schema, which is no constraint at all. After dereferencing the member *is* this
  // object, so drop it by identity. Kept, it would come out as the type being declared
  // (`type A = A & {...}`), an alias TypeScript rejects as circular (TS2456).
  if (Array.isArray(schema.allOf) && schema.allOf.includes(schema)) {
    schema.allOf = schema.allOf.filter(_ => _ !== schema)
  }
})

// Compares the whole `definitions` and `$defs` subtrees, so no other rule may be part-way through
// rewriting them
startNewPass()

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

// Deleting `const` stops the walk from descending into an object-valued `const`, which the rules
// above do visit (`enum` is on the traversal blacklist, `const` is not)
startNewPass()

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

// Runs this late so that the schema has already been named from its `$ref` path, had
// its object defaults filled in, its `const` turned into an `enum` and its `tsEnumNames`
// inferred (all of which look at keywords that move into the `anyOf`), and before types
// are pre-calculated. It adds the `anyOf` members to the tree, which only this rule and the
// ones after it get to see.
startNewPass()

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

rules.set(
  'With `formatTypes`, a schema that only bounds values is a string if its `format` is mapped',
  (schema, _, options) => {
    // `format` alone doesn't make a schema a string (it constrains strings and lets everything
    // else through), but mapping it to a type says which type the caller wants such values read as
    if (schema.type === undefined && formatTypeOf(schema, options) !== undefined && isShapeless(schema)) {
      schema.type = 'string'
    }
  },
)

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
//
// `applySchemaTyping` moves a typed schema's `allOf` into its intersection, which `traverse`
// visits after everything else rather than first; in a shared walk that would change the order
// in which the rule above reaches a schema used in two places, and so the `key` it names it by.
startNewPass()

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
  passes.forEach(pass =>
    traverse(rootSchema, (schema, key) => {
      for (const rule of pass) {
        rule(schema, filename, options, key, dereferencedPaths)
      }
    }),
  )
  return rootSchema as NormalizedJSONSchema
}
