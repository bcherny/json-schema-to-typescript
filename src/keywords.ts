/**
 * The JSON-Schema keywords this tool tells apart, and what each one holds.
 *
 * Every phase that has to classify keywords -- which keys hold subschemas to walk, which hold
 * instance data to leave alone, which decide the emitted type, which merely describe it --
 * derives its set from this table (see the exports below it), so teaching the tool a keyword
 * is one row here. Keywords a phase only ever reads by name (`nullable`, `$ref`) need no row
 * until some phase has to classify them.
 */

/** What a keyword's value is, when that is or contains subschemas */
export type SchemaHolds =
  /** one subschema (`not`) */
  | 'schema'
  /** one subschema or, already in draft 4, a boolean flag in its place (`additionalProperties`) */
  | 'schemaOrBoolean'
  /** one subschema or an array of them (`items`) */
  | 'schemaOrSchemaArray'
  /** an array of subschemas (`allOf`) */
  | 'schemaArray'
  /** a map from names to subschemas (`properties`, `definitions`) */
  | 'schemaMap'

/** What a keyword's value is */
type Holds =
  | SchemaHolds
  /** arbitrary JSON instance data: it can look like a schema, but never is one (`enum`, `default`) */
  | 'json'
  /** the keyword's own scalar or string-list value (`type`, `required`, `title`) */
  | 'data'

interface Keyword {
  holds: Holds
  /**
   * Decides, on its own, which type a schema becomes: a `typesOfSchema` matcher or a
   * type-changing normalizer rule keys off of it, or the parser reads it whatever the matched
   * type (`extends`) -- so a schema made up only of keywords without this flag is one the tool
   * has no notion of (refining keywords: see `refines`). `'fallback'`: the type it implies
   * yields to any other source of one (`default`).
   */
  typed?: true | 'fallback'
  /**
   * Refines a type some other keyword established, in a way the emitted type shows: the
   * normalizer or parser reads it (`minItems` next to `items` makes a tuple), though on its
   * own it decides nothing.
   */
  refines?: true
  /**
   * Names, places or documents the schema, or hosts other schemas' definitions -- as opposed
   * to keywords that speak about instance values (constraints, defaults, examples). These stay
   * put when a schema's constraints are moved into a subschema of it, and the ones that host
   * definitions give the schema no shape of its own (`STRUCTURAL_KEYWORDS`).
   */
  meta?: true
  /**
   * Says nothing about which values validate or which type to emit: at most it surfaces in the
   * emitted type's comment (`title` can name the type and `default` implies one, so neither is
   * one of these).
   */
  annotation?: true
}

export const KEYWORDS = {
  // Subschema positions. `traverse` visits them in row order, and the first visit of a schema
  // reachable along several paths decides the key it is reported under: keep the order.
  anyOf: {holds: 'schemaArray', typed: true},
  allOf: {holds: 'schemaArray', typed: true},
  oneOf: {holds: 'schemaArray', typed: true},
  properties: {holds: 'schemaMap', typed: true},
  patternProperties: {holds: 'schemaMap', typed: true},
  additionalProperties: {holds: 'schemaOrBoolean', typed: true},
  unevaluatedProperties: {holds: 'schemaOrBoolean', refines: true}, // 2019-09; the normalizer folds it into `additionalProperties`
  items: {holds: 'schemaOrSchemaArray', typed: true},
  prefixItems: {holds: 'schemaArray', typed: true}, // 2020-12; the normalizer renames it to the tuple form of `items`
  additionalItems: {holds: 'schemaOrBoolean', refines: true},
  dependencies: {holds: 'schemaMap'}, // or, per name, a string array
  definitions: {holds: 'schemaMap', meta: true},
  $defs: {holds: 'schemaMap', meta: true},
  not: {holds: 'schema'},
  if: {holds: 'schema'},
  then: {holds: 'schema'},
  else: {holds: 'schema'},
  extends: {holds: 'schemaOrSchemaArray', typed: true}, // draft 3

  // Identity, documentation and other annotations
  id: {holds: 'data', meta: true}, // draft 4
  $id: {holds: 'data', meta: true}, // names the type; the shape is the same with or without it
  $schema: {holds: 'data', meta: true},
  $comment: {holds: 'data', annotation: true},
  title: {holds: 'data', meta: true},
  description: {holds: 'data', meta: true, annotation: true},
  deprecated: {holds: 'data', meta: true, annotation: true},
  readOnly: {holds: 'data', annotation: true},
  writeOnly: {holds: 'data', annotation: true},

  // Instance data
  default: {holds: 'json', typed: 'fallback'},
  examples: {holds: 'json', annotation: true},
  enum: {holds: 'json', typed: true},
  const: {holds: 'json', typed: true},

  // Validation
  type: {holds: 'data', typed: true},
  multipleOf: {holds: 'data'},
  maximum: {holds: 'data'},
  exclusiveMaximum: {holds: 'data'},
  minimum: {holds: 'data'},
  exclusiveMinimum: {holds: 'data'},
  maxLength: {holds: 'data'},
  minLength: {holds: 'data'},
  pattern: {holds: 'data'},
  maxItems: {holds: 'data', refines: true},
  minItems: {holds: 'data', refines: true},
  uniqueItems: {holds: 'data'},
  maxProperties: {holds: 'data'},
  minProperties: {holds: 'data', refines: true},
  required: {holds: 'data', typed: true}, // a string array; in draft 3, a boolean
  format: {holds: 'data', refines: true}, // through the `formatTypes` option

  // This tool's own extensions
  tsType: {holds: 'data', typed: true},
  tsEnumNames: {holds: 'data', typed: true},
} satisfies Record<string, Keyword>

export type KeywordName = keyof typeof KEYWORDS

const NAMES = Object.keys(KEYWORDS) as KeywordName[]

function keywordsWhere(predicate: (keyword: Keyword, name: KeywordName) => boolean): ReadonlySet<string> {
  return new Set(NAMES.filter(name => predicate(KEYWORDS[name], name)))
}

function holdsSchemas(holds: Holds): holds is SchemaHolds {
  return holds !== 'json' && holds !== 'data'
}

/**
 * Where the hand-kept lists this table replaces disagreed with it. Each entry keeps one
 * caller's set exactly as it was before there was a table. The ones marked observable change
 * some (odd) schema's output when dropped, so each of those goes in a change of its own; the
 * rest only ever mattered for values of the wrong type, and can go whenever the pinned sets in
 * test/keywords.test.ts are next touched.
 *
 * One old branch is not kept: `traverse` walked an array-valued `dependencies` (not valid in
 * any draft) member by member, whatever the member; as the map it has to be, its plain-object
 * members are visited exactly as before and the others (booleans, strings, numbers, `null`,
 * nested arrays) no longer reach the callback.
 */
const LEGACY = {
  /**
   * Observable. `traverse` never visited `extends` as a subschema position: the definitions
   * scan at its end reaches an `extends` array's members instead (and, for a single `extends`
   * schema, that schema's children rather than the schema itself).
   */
  notTraversed: new Set<KeywordName>(['extends']),
  /**
   * ...and its definitions scan still descends into these. Observable for `const`, `examples`
   * and `extends`, whose object values get walked (and normalized) as if they were definitions.
   */
  scannedForDefinitions: new Set<KeywordName>([
    'extends',
    '$comment',
    'deprecated',
    'readOnly',
    'writeOnly',
    'examples',
    'const',
    'tsType',
    'tsEnumNames',
  ]),
  /**
   * `isSchemaLike` also counts these as containers whose direct children are not schemas, for
   * an object the definitions scan finds directly under one: they hold values and names.
   */
  containers: new Set<KeywordName>(['enum', 'required']),
  /**
   * Observable. `id` means `$id`, and the normalizer renames it to that before any rule asks
   * whether it is `meta` -- except the pre-dereference `nullable` pass, which moved a draft-4
   * `id` next to `$ref` + `nullable` into the `anyOf` along with the `$ref`.
   */
  notMeta: new Set<KeywordName>(['id']),
}

/** The subschema positions `traverse` descends into, and what each holds, in visiting order */
export const SUBSCHEMA_KEYWORDS: ReadonlyArray<readonly [KeywordName, SchemaHolds]> = NAMES.flatMap(name => {
  const {holds} = KEYWORDS[name]
  return holdsSchemas(holds) && !LEGACY.notTraversed.has(name) ? [[name, holds] as const] : []
})

/**
 * Every keyword (bar the `LEGACY` carve-outs above). Definitions can technically sit under any
 * key, so `traverse` also looks for them one level below each key of a schema that is not one
 * of these.
 */
export const NOT_SCANNED_FOR_DEFINITIONS = keywordsWhere((_, name) => !LEGACY.scannedForDefinitions.has(name))

/**
 * Keywords whose value is a container (an array or map) rather than a schema: an object that
 * sits directly under one of these is a member or entry, which `isSchemaLike` uses to tell a
 * `properties` map from a schema.
 */
export const CONTAINER_KEYWORDS = keywordsWhere(
  ({holds}, name) => holds === 'schemaArray' || holds === 'schemaMap' || LEGACY.containers.has(name),
)

/**
 * Keywords that hold instance data, never a schema: nothing underneath them is a `$ref`, an
 * `$id` or a subschema, whatever it looks like.
 */
export const JSON_DATA_KEYWORDS = keywordsWhere(({holds}) => holds === 'json')

/** @see Keyword.meta */
export const META_KEYWORDS = keywordsWhere(({meta}, name) => meta === true && !LEGACY.notMeta.has(name))

/** @see Keyword.typed */
export const TYPE_SHAPING_KEYWORDS = keywordsWhere(({typed}) => typed !== undefined)

/**
 * Keywords that have a say in the emitted type or its name, unless something else decides it:
 * the type-shaping ones bar fallbacks, the refining ones, and `$id` (draft 4: `id`, renamed
 * only later, by the normalizer), which names it. Next to a `$ref`, one of these asks for a
 * variant of the referenced type; any other keyword there describes whatever holds the reference.
 */
export const TYPE_RELEVANT_KEYWORDS = keywordsWhere(
  ({typed, refines}, name) => typed === true || refines === true || name === 'id' || name === '$id',
)

/**
 * Keywords that give a schema a shape of its own: the ones that decide its type (`Keyword.typed`)
 * and the ones that apply subschemas to the instance, implemented (`properties`) or not (`not`,
 * `if`) -- a schema made up of only the latter is one this tool has no notion of. A schema with
 * none of either -- only bounds on values (`pattern`, `maximum`), annotations, `format`,
 * `nullable`, definitions for other schemas to use (`$defs`), or keys this tool has never heard
 * of -- says nothing about which type a value is: it is the empty schema.
 */
export const STRUCTURAL_KEYWORDS = keywordsWhere(
  ({holds, meta, typed}) => typed === true || (holdsSchemas(holds) && meta !== true),
)

/** @see Keyword.annotation */
export const ANNOTATION_KEYWORDS = keywordsWhere(({annotation}) => annotation === true)
