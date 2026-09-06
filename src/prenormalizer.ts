import {isPlainObject} from 'lodash'
import {JSONSchema, LinkedJSONSchema} from './types/JSONSchema'
import {eachSchemaNode, hasType, traverse} from './utils'
import {META_KEYWORDS, TYPE_RELEVANT_KEYWORDS} from './keywords'

/**
 * Rewrites that have to happen on the raw document, before it goes to the ref-parser --
 * each rule below says why it cannot wait for the normalizer. Rules work on plain JSON
 * (there is no `Parent` link yet) and change the schema in place.
 */
type Rule = (schema: JSONSchema, document: JSONSchema) => void
const rules = new Map<string, Rule>()

/**
 * OpenAPI 3.0 `nullable: true` becomes `anyOf: [<schema>, {type: 'null'}]`, which the
 * parser already turns into `X | null` for every shape of schema (typed or untyped,
 * enum, const, allOf, array...). Keywords that describe the property or definition rather
 * than its values (or that host other schemas) stay on the outer schema. Schemas whose
 * `type` or `enum` already allow null, and schemas that constrain nothing (only such
 * keywords next to `nullable`), are left as they are. The schema is rewritten in place,
 * so every reference to it sees the union.
 *
 * `enumName` matters only to the normalizer's `nullable` rule, by which time `tsEnumNames`
 * have been inferred: a TypeScript enum (`enum` + `tsEnumNames`) cannot be an anonymous
 * union member, so it takes its `title` with it, or else is named after `enumName` (the
 * key or definition it sits under) - the name the parser would have given it in place.
 *
 * Returns the schema that moved into the `anyOf`, if any.
 */
export function normalizeNullable(schema: JSONSchema, enumName?: string): JSONSchema | undefined {
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
  // `readOnly` ends up in both places: it moved into the member with every other non-meta
  // keyword (where it makes an array or tuple value `readonly T[]`), and is put back on the
  // outer schema because it also describes the property (its `readonly` modifier)
  if (inner.readOnly === true) {
    schema.readOnly = true
  }
  schema.anyOf = [inner, {type: 'null'}]
  return inner
}

/**
 * `nullable` next to a `$ref` has to be rewritten before dereferencing, while it still
 * visibly belongs to the referencing schema: the ref parser folds `$ref` siblings into a
 * copy of the target, where it would read as if the target itself were nullable (and
 * the copy would be emitted as a second, identical type). Everything else waits for the
 * normalizer's `nullable` rule, which also reaches schemas in other files, once
 * dereferencing has pulled them in.
 */
rules.set('Transform `nullable` next to a `$ref` to anyOf with null', schema => {
  if (schema.$ref) {
    normalizeNullable(schema)
  }
})

/** Draft 3's `required: true` flags the property, like an annotation; draft 4's list shapes the type */
function asksForOwnType(schema: JSONSchema, key: string): boolean {
  return TYPE_RELEVANT_KEYWORDS.has(key) && !(key === 'required' && typeof schema.required === 'boolean')
}

/**
 * The ref parser replaces a `$ref` that has sibling keywords with a shallow copy of its
 * target, the siblings merged in -- a new object per reference; and downstream, a schema's
 * identity is its type's identity (hence a `Foo1` per documented reference to `Foo`).
 *
 * So when no sibling has a say in the type (see `TYPE_RELEVANT_KEYWORDS`; that leaves
 * `description`, `examples`, `default`, `deprecated`, `readOnly`, validation keywords with no
 * TypeScript rendering, editor and vendor extensions...), the siblings stay where they are and
 * the reference moves into a one-member `allOf` -- the way draft 2019-09 reads a `$ref` with
 * siblings. The `$ref` then resolves to the target itself, the property is typed with the one
 * named type, and its `description`/`deprecated` print where the parser prints a property
 * schema's own. A `title` there labels the property: it is dropped rather than left to name a
 * one-member intersection (`type Label = Foo`), which `{title, allOf: [{$ref}]}` still does
 * for whoever wants the alias. The document root is left alone: its keywords describe the
 * type the document stands for (see `resolveRootRef`).
 *
 * Has to happen before dereferencing, while the `$ref` can still be told from its siblings.
 */
rules.set('Keep `$ref` siblings that have no say in the type on the referencing schema', (schema, document) => {
  if (typeof schema.$ref !== 'string' || schema === document) {
    return
  }
  const siblings = Object.keys(schema).filter(key => key !== '$ref')
  if (!siblings.length || siblings.some(key => asksForOwnType(schema, key))) {
    return
  }
  delete schema.title
  if (siblings.some(key => key !== 'title')) {
    schema.allOf = [{$ref: schema.$ref}]
    delete schema.$ref
  }
})

/**
 * `unevaluatedProperties` next to a `$ref` also counts what the target evaluates, and the ref
 * parser is about to merge the two into a copy that can drop the target's `properties` (#613):
 * the normalizer's fold into `additionalProperties` would then close the object over keys that
 * were never emitted. Until `$ref` siblings are emitted as an intersection, drop the keyword
 * here, while the `$ref` is still visible, and leave the object open as it was before.
 */
rules.set('Drop `unevaluatedProperties` next to a `$ref`', schema => {
  if (schema.$ref) {
    delete schema.unevaluatedProperties
  }
})

/**
 * $RefParser can't correctly dereference a schema whose root is itself a
 * `$ref`: it leaves `$ref: "#"` behind on the root instead of resolving it,
 * which trips the parser's "Refs should have been resolved by the resolver!"
 * invariant downstream. This holds regardless of what the `$ref` ultimately
 * points at -- a plain schema (#132) or another `$ref` (#740) -- so resolve
 * the root's own `$ref` chain ourselves first, via plain in-document JSON
 * Pointer lookups, before handing the schema off to $RefParser to resolve
 * everything else (which it does correctly once the root itself isn't a
 * `$ref`). The same goes for a file loaded through a `$ref`: $RefParser copes
 * with one hop at its root, but not with a chain, nor with a JSON Pointer into a
 * file whose root is a `$ref` -- so every document gets this, not only the one
 * being compiled. Only *internal* pointers (`#/...`) are handled here, since those
 * are the only ones affected; a root `$ref` to an external file/URL is left
 * for $RefParser to resolve, as before. A boolean schema at the end of the
 * chain joins the root's `allOf` ($RefParser 11 put the boolean in the whole
 * document's place, 16 reports a missing pointer).
 */
function resolveRootRef(schema: JSONSchema): void {
  if (!isPlainObject(schema) || typeof schema.$ref !== 'string' || !schema.$ref.startsWith('#/')) {
    return
  }

  // Pointer lookups always walk this pristine snapshot of the original top level,
  // never the live `schema` we're mutating below -- otherwise a target merged in by
  // an earlier hop could shadow a same-named container (e.g. its own nested
  // `definitions`) and cause a later hop to resolve against the wrong one.
  const documentRoot: JSONSchema = {...schema}
  // A key wins over any same-named key pulled in from a hop further down the chain,
  // starting with the root's own keys and then growing as each hop's keys are
  // claimed -- so the closest schema to the root always wins ties, matching how
  // $RefParser itself merges a `$ref` with sibling keywords everywhere else.
  const claimedKeys = new Set(Object.keys(schema).filter(key => key !== '$ref'))

  const seenPointers = new Set<string>()
  while (isPlainObject(schema) && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/')) {
    const pointer = schema.$ref
    if (seenPointers.has(pointer)) {
      break // circular root $ref; fall through to the same crash this had before this fix
    }
    seenPointers.add(pointer)

    const target = pointer
      .slice(2)
      .split('/')
      .reduce<unknown>((node, segment) => {
        if (!isPlainObject(node) && !Array.isArray(node)) {
          return undefined
        }
        const key = safeDecodeURIComponent(segment.replace(/~1/g, '/').replace(/~0/g, '~'))
        // Only an own property is a real JSON Pointer match -- otherwise a segment
        // like `__proto__` would resolve via the prototype chain instead of failing.
        return Object.prototype.hasOwnProperty.call(node, key) ? (node as Record<string, unknown>)[key] : undefined
      }, documentRoot)

    if (typeof target === 'boolean') {
      // A boolean schema, which the root cannot become in place: keep it as the root's one more
      // `allOf` member instead, as a `$ref` below the root would be kept (`never` or `unknown`)
      delete schema.$ref
      setOwn(schema, 'allOf', [...(Array.isArray(schema.allOf) ? schema.allOf : []), target])
      break
    }
    if (!isPlainObject(target)) {
      break // not a schema in this document; let $RefParser handle/report it
    }

    delete schema.$ref
    for (const [key, value] of Object.entries(target as Record<string, unknown>)) {
      if (key === '$ref') {
        setOwn(schema, key, value)
      } else if (!claimedKeys.has(key)) {
        setOwn(schema, key, value)
        claimedKeys.add(key)
      }
    }
  }
}

// A JSON Pointer segment isn't guaranteed to be a valid percent-encoding (it may
// contain a literal, unescaped `%`), so fall back to the raw segment rather than
// letting decodeURIComponent throw.
function safeDecodeURIComponent(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

// Schema keys are attacker/document-controlled and may include names like
// `__proto__`: plain `obj[key] = value` assignment goes through the prototype
// chain's setters, so a `__proto__` key would reassign obj's actual prototype
// instead of setting a data property. Define the property directly instead.
function setOwn(obj: object, key: string, value: unknown): void {
  Object.defineProperty(obj, key, {value, writable: true, enumerable: true, configurable: true})
}

/**
 * Runs the rules over one document, then resolves its root `$ref` (anything else a parser may
 * produce passes through) -- for the schema being compiled and for every file loaded for it.
 */
export function prenormalizeDocument<T>(document: T): T {
  if (isPlainObject(document)) {
    // Every rule per node, wherever the ref parser will look for a `$ref`: `traverse` knows where
    // subschemas live (and reads no `Parent` links, so a raw document is fine despite its parameter
    // type) but not positions this tool has no keyword for, such as OpenAPI's
    // `components/schemas/Pet/properties/owner`; `eachSchemaNode` reaches those, and skips only
    // what sits under an instance-data keyword -- or a property that happens to be named like
    // one, hence both walks. The rules are idempotent, and see the subschemas they create.
    const apply = (schema: JSONSchema) => rules.forEach(rule => rule(schema, document as JSONSchema))
    traverse(document as LinkedJSONSchema, apply)
    eachSchemaNode(document, apply)
    resolveRootRef(document as JSONSchema)
  }
  return document
}

/** The entry point for the schema being compiled: the same rewrites as a loaded file gets */
export function prenormalize(schema: JSONSchema): void {
  prenormalizeDocument(schema)
}
