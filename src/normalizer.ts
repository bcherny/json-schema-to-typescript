import {DefinitionKey, isBoolean, isPrimitive, LinkedJSONSchema, NormalizedJSONSchema, Shared} from './types/JSONSchema'
import {formatTypeOf, hasType, isSchemaLike, justName, log, narrowType, toSafeString, traverse} from './utils'
import {normalizeNullable} from './prenormalizer'
import {Options} from './'
import {applySchemaTyping, hasOwnType, isShapeless} from './typesOfSchema'
import {DereferencedPaths} from './resolver'
import {isDeepStrictEqual} from 'util'

type Rule = (
  schema: LinkedJSONSchema,
  fileName: string,
  options: Options,
  key: string | null,
  parent: LinkedJSONSchema | null,
  dereferencedPaths: DereferencedPaths,
  rootSchema: LinkedJSONSchema,
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

// A member of an `anyOf`/`oneOf` only ever matches values that also match the schema around it,
// so the parent's `type` bounds every member. Left alone, an untyped member falls through to the
// generic `UNNAMED_SCHEMA` default (an open object) instead of picking up the `type` its parent
// already declared, and a typed member is parsed as if the parent had no `type`: `{type: 'object',
// oneOf: [{type: 'string'}, {...}]}` would admit strings. So an untyped member inherits the
// parent's `type`, a typed one is narrowed to the types both admit, and a member left with no
// type at all can never match and is dropped. Runs this early so that the rules below normalize
// an inherited `array` like a declared one.
rules.set('Constrain `anyOf`/`oneOf` members to the parent `type`', (schema, _, _o, _k, _p, dereferencedPaths) => {
  const {type} = schema
  if ((typeof type !== 'string' && !Array.isArray(type)) || !(schema.anyOf || schema.oneOf)) {
    return
  }
  // Narrows `owner[key]` to what a value of the parent `type` can match; says whether it changed.
  // The list is edited in place only when it is the owner's alone: a `$ref` with sibling keywords
  // is dereferenced into a shallow COPY of its target, list and all, and a copy made below
  // (`copied`) shares its lists with the original. Otherwise the owner gets a narrowed list of its
  // own and the other holder keeps the one it had. `seen` stops a member that contains itself.
  const constrain = (owner: LinkedJSONSchema, key: 'anyOf' | 'oneOf', seen: Set<LinkedJSONSchema>, copied = false) => {
    const members: LinkedMembers | undefined = owner[key]
    if (!members) {
      return false
    }
    const owned = !copied && !members[Shared]
    let changed = false
    const constrained = members.flatMap((member): LinkedJSONSchema[] => {
      // `anyOf`/`oneOf` members are typed as `LinkedJSONSchema`, but a boolean
      // schema (`true`/`false`) can still show up here at runtime.
      if (typeof member !== 'object' || !member || seen.has(member)) {
        return [member]
      }
      // A member that was a `$ref` is now the shared definition object itself: leave it
      // alone so the definition keeps its name and type. Any other member is replaced by a
      // typed COPY rather than written to, so an object shared by other means (YAML
      // anchors, programmatic callers) is not retyped everywhere else it appears.
      const dereferenced = dereferencedPaths.has(member)
      if (member.type === undefined) {
        // An untyped member already parses as an open object, so an `object` parent has
        // nothing to add (and its required-only members are the parser's to narrow).
        if (typeof type === 'string' && type !== 'object' && !hasOwnType(member) && !dereferenced) {
          changed = true
          return [{...copyOf(member), type}]
        }
        if (dereferenced || !(member.anyOf || member.oneOf)) {
          return [member]
        }
        // The bound carries through a member that leaves the typing to an `anyOf`/`oneOf` of
        // its own: on the member itself when it is ours alone, on a copy when not
        const target = owned && !member[Shared] ? member : copyOf(member)
        seen.add(member)
        const narrowedAny = constrain(target, 'anyOf', seen, target !== member)
        const narrowedOne = constrain(target, 'oneOf', seen, target !== member)
        seen.delete(member)
        if (target.anyOf?.length === 0 || target.oneOf?.length === 0) {
          changed = true
          return []
        }
        if (target === member || !(narrowedAny || narrowedOne)) {
          return [member]
        }
        changed = true
        return [target]
      }
      const narrowed = narrowType(member, type)
      if (narrowed === false) {
        changed = true
        return []
      }
      if (narrowed === undefined || dereferenced) {
        return [member]
      }
      changed = true
      return [{...copyOf(member), type: narrowed}]
    })
    if (!changed) {
      return false
    }
    if (owned) {
      members.splice(0, members.length, ...constrained)
    } else {
      // The members kept as they are now sit in this list and in the other holder's
      constrained.forEach(member => members.includes(member) && markShared(member))
      owner[key] = constrained
    }
    if (!constrained.length) {
      log('yellow', 'normalizer', `No ${key} member is compatible with the parent type (${type}): emits never`, owner)
    }
    return true
  }
  const seen = new Set([schema])
  constrain(schema, 'anyOf', seen)
  constrain(schema, 'oneOf', seen)
})

/** An `anyOf`/`oneOf` list, knowing whether another schema holds it too (see `markShared`, resolver.ts) */
type LinkedMembers = LinkedJSONSchema[] & {readonly [Shared]?: true}

function markShared(node: LinkedJSONSchema | LinkedMembers | boolean): void {
  if (typeof node === 'object') {
    Object.defineProperty(node, Shared, {enumerable: false, value: true, writable: false})
  }
}

/** A shallow copy shares its `anyOf`/`oneOf` lists with the original: says so on the lists */
function copyOf(schema: LinkedJSONSchema): LinkedJSONSchema {
  ;[schema.anyOf, schema.oneOf].forEach(members => members && markShared(members))
  return {...schema}
}

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

// `unevaluatedProperties` (draft 2019-09+) constrains the keys no keyword accounted for,
// counting the keys evaluated by in-place applicators. Where the emitted type covers every
// key those applicators contribute, that is the same set `additionalProperties` covers, so
// fold it into the handling we already have rather than teaching the parser a second way to
// say the same thing. Where it does not (`emitsWhatItEvaluates`), closing the object would
// reject instances the spec accepts, so the keyword is dropped and the object stays open, as
// it was before the keyword was supported. A `$ref` with siblings is the prenormalizer's
// case: by now it has been merged away. An explicit `additionalProperties` is the narrower
// constraint, so it wins.
rules.set('Treat `unevaluatedProperties` as `additionalProperties`', schema => {
  // `traverse` also visits boolean schemas, where `in` would throw.
  if (typeof schema !== 'object' || schema === null || schema.unevaluatedProperties === undefined) {
    return
  }
  // A schema (rather than a boolean) becomes a typed index signature on the object's own
  // interface, and an intersection holds the `allOf`/`anyOf`/`oneOf` members' keys to it too
  // (`{[k: string]: string} & {x: number}` rejects {"x": 1}), so that form folds only where
  // there is nothing to intersect with.
  const folds =
    emitsWhatItEvaluates(schema) &&
    (isBoolean(schema.unevaluatedProperties) || !INTERSECTED_APPLICATORS.some(key => schema[key]))
  if (schema.additionalProperties === undefined && folds) {
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

// In-place applicators that evaluate keys the emitted type never reflects (`then`/`else` only
// ever apply through an `if`; `not` contributes nothing). Not KEYWORDS rows: half of them have
// none, and a row changes what `traverse` visits.
const UNEMITTED_APPLICATORS = ['if', 'dependentSchemas', '$dynamicRef', '$recursiveRef'] as const
// In-place applicators emitted as an intersection with the object's own interface: a member's
// keys satisfy that intersection whether or not the interface is closed, as long as the member
// itself emits what it evaluates (one made of `if`/`then` alone parses as `{}` and is dropped).
const INTERSECTED_APPLICATORS = ['allOf', 'anyOf', 'oneOf'] as const

function emitsWhatItEvaluates(schema: LinkedJSONSchema | boolean, seen = new Set<LinkedJSONSchema>()): boolean {
  // a boolean schema evaluates no keys; a schema met again is a dereferenced cycle or already passed
  if (isBoolean(schema) || seen.has(schema)) {
    return true
  }
  seen.add(schema)
  return (
    !UNEMITTED_APPLICATORS.some(key => key in schema) &&
    INTERSECTED_APPLICATORS.every(
      key => !schema[key] || schema[key].every(member => emitsWhatItEvaluates(member, seen)),
    )
  )
}

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

rules.set('Transform id to $id', (schema, fileName, _options, _key, parent) => {
  if (!isSchemaLike(schema, parent)) {
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

rules.set('Add an $id to anything that needs it', (schema, fileName, _o, _k, parent, dereferencedPaths, rootSchema) => {
  if (!isSchemaLike(schema, parent)) {
    return
  }

  // Top-level schema. A name with no usable identifier characters (stdin, or a file
  // called `2024.json`) gets the same placeholder generateName() uses, rather than an
  // empty `$id` -- which would leave the root type undeclared and the output empty.
  if (!schema.$id && schema === rootSchema) {
    schema.$id = toSafeString(justName(fileName)) || 'NoName'
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
  if (typeof schema.description === 'string') {
    schema.description = schema.description.replace(/\*\//g, '* /')
  }
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
    const tags = commentsToAppend.join('\n')
    schema.description = schema.description ? `${schema.description}\n\n${tags}` : tags
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

// What an array schema's `items` get multiplied by (below): noted when the walk reaches the
// array, read when it reaches the `items`
const itemsMultipliers = new WeakMap<LinkedJSONSchema, number>()

rules.set('Remove maxItems if it is big enough to likely cause OOMs', (schema, _fileName, options, _key, parent) => {
  if (options.ignoreMinAndMaxItems || options.maxItems === -1) {
    return
  }
  if (!isArrayType(schema)) {
    return
  }
  // A tuple isn't expanded in isolation: it's expanded once for every combination of
  // its enclosing bounded arrays, so nested bounded arrays multiply together (an array
  // of N arrays of M items can emit up to N*M item combinations). Fold in that
  // multiplier so we don't only catch schemas that are too big on their own while
  // missing ones that are only too big once nested. The array around this one is
  // already normalized by the time we get here, since rules traverse parent-first.
  // A named `items` type is printed once, however many arrays hold it: it counts alone.
  let multiplier = 1
  if (parent !== null && parent.items === schema && isArrayType(parent) && !schema.$id && !schema.title) {
    const {maxItems, minItems} = parent
    multiplier =
      (itemsMultipliers.get(parent) ?? 1) * (typeof maxItems === 'number' ? maxItems : (minItems as number) || 1)
  }
  itemsMultipliers.set(schema, multiplier)
  const {maxItems, minItems} = schema
  // minItems is guaranteed to be a number after the previous rule runs
  if (maxItems !== undefined && (maxItems - (minItems as number)) * multiplier > options.maxItems) {
    delete schema.maxItems
  }
})

// The rule above compares the `items` of the array around each schema with it, so it has to
// have run everywhere before this one rewrites any `items` into a tuple
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
    options.inferStringEnumKeysFromValues &&
    schema.type === 'string' &&
    schema.tsEnumNames === undefined &&
    // A TypeScript enum member's value must be a string or a number, so only
    // string values can be turned into enum members. Mixed enums (`["a", null]`)
    // stay unions instead of becoming `null = null`, which does not compile.
    schema.enum?.every(value => typeof value === 'string') &&
    !schemasNormalizedFromConst.has(schema)
  ) {
    schema.tsEnumNames = schema.enum.map(String)
  }
})

// Runs this late so that the schema has already been named from its `$ref` path, had
// its object defaults filled in, its `const` turned into an `enum` and its `tsEnumNames`
// inferred (all of which look at keywords that move into the `anyOf`), and before types
// are pre-calculated. It adds the `anyOf` members to the tree, which only this rule and the
// ones after it get to see.
startNewPass()

rules.set('Transform `nullable` to anyOf with null', (schema, _, _options, key, _p, dereferencedPaths, rootSchema) => {
  // The name a TypeScript enum gets in this position: the definition it was dereferenced
  // from, else the key it sits under (unless that is just an index into anyOf/items)
  const dereferencedName = dereferencedPaths.get(schema)
  const enumName = dereferencedName ? justName(dereferencedName) : key && isNaN(+key) ? key : undefined
  const inner = normalizeNullable(schema, enumName)
  if (!inner) {
    return
  }
  // A nullable enum that is itself a definition keeps the definition's name (and so its
  // `enum` declaration); references to it become `Name | null`
  if ('tsEnumNames' in inner) {
    const $defs = rootSchema.$defs ?? {}
    for (const name of Object.keys($defs)) {
      if ($defs[name] === schema) {
        $defs[name] = inner as LinkedJSONSchema
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
    traverse(rootSchema, (schema, key, parent) => {
      for (const rule of pass) {
        rule(schema, filename, options, key, parent, dereferencedPaths, rootSchema)
      }
    }),
  )
  // Last, now that the root's definitions are final: record on each one the (first) key it is
  // held under -- the name the parser declares it by. A key here takes precedence over one the
  // resolver recorded from the separate file the schema came from (#143).
  const $defs = rootSchema.$defs ?? {}
  const named = new Set<LinkedJSONSchema>()
  for (const key of Object.keys($defs)) {
    const definition = $defs[key]
    if (!isPrimitive(definition) && !named.has(definition)) {
      Object.defineProperty(definition, DefinitionKey, {configurable: true, enumerable: false, value: key})
      named.add(definition)
    }
  }
  return rootSchema as NormalizedJSONSchema
}
