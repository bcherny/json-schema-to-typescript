import {isEmpty, isPlainObject} from 'lodash'
import {JSONSchema, LinkedJSONSchema} from './types/JSONSchema'
import {eachSchemaNode, hasType, traverse} from './utils'
import {EXTENDING_KEYWORDS, META_KEYWORDS, TYPE_RELEVANT_KEYWORDS, VALIDATION_KEYWORDS} from './keywords'

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
function isRequiredFlag(schema: JSONSchema, key: string): boolean {
  return key === 'required' && typeof schema.required === 'boolean'
}

function asksForOwnType(schema: JSONSchema, key: string): boolean {
  return TYPE_RELEVANT_KEYWORDS.has(key) && !isRequiredFlag(schema, key)
}

/**
 * The ref parser replaces a `$ref` that has sibling keywords with a shallow copy of its target,
 * the siblings merged in, and a keyword both have keeps the sibling's value: `properties` next
 * to a `$ref` shadow every property of the target, `required` its required list, `oneOf` its
 * alternatives -- and the copy takes the target's `title`, for a second, different type of the
 * same name. Since draft 2019-09 `$ref` is an applicator like any other and its siblings apply
 * alongside it: `{$ref: A, properties: P}` is `{allOf: [{$ref: A}, {properties: P}]}`, the way
 * schemars, the OpenAPI 3.1 meta-schema and hand-written 2020-12 schemas spell "an A, plus
 * these" (the drafts before said to ignore such siblings, which this tool never did).
 *
 * So when a sibling adds members to the type (`EXTENDING_KEYWORDS`), the reference and what the
 * schema asserts beside it (`VALIDATION_KEYWORDS`: the `type: 'object'` that goes with the
 * `properties`, `unevaluatedProperties`...) become two members of an `allOf`, emitted as
 * `A & {...}`, and the target keeps its one name; a sibling `allOf` joins it rather than nest.
 * What speaks about the schema's position rather than its values -- `title` (which then names
 * the composite), `description`, `default`, `readOnly`, definitions, keys this tool does not
 * know -- stays where it is, as in the annotation-only case below. The document root is
 * included: `resolveRootRef` merges the same way. With `tsType`/`tsEnumNames`, which dictate
 * the emitted type whatever else the schema says, there is nothing to compose: the copy stays.
 * It also stays for siblings that only restate or adjust what the target says (`type` alone,
 * `enum`, `const`, `additionalProperties`, `minItems`, `format`...): `"a" | "b"`, a closed
 * `Foo` or a tuple reads better than an intersection saying the same. An empty `properties`,
 * `patternProperties` or `required` extends nothing (and `required: []`, merged into the copy,
 * made every property of the target optional): those are dropped.
 *
 * This and the two rules after it have to run before dereferencing, while a `$ref` can still be
 * told from its siblings.
 */
rules.set('Compose a `$ref` with the siblings that extend its target', schema => {
  if (typeof schema.$ref !== 'string' || 'tsType' in schema || 'tsEnumNames' in schema) {
    return
  }
  for (const key of ['properties', 'patternProperties', 'required'] as const) {
    const value = schema[key]
    if ((isPlainObject(value) || Array.isArray(value)) && isEmpty(value)) {
      delete schema[key]
    }
  }
  const siblings = Object.keys(schema).filter(key => key !== '$ref' && !isRequiredFlag(schema, key))
  if (!siblings.some(key => EXTENDING_KEYWORDS.has(key))) {
    return
  }
  const members: JSONSchema[] = [{$ref: schema.$ref}]
  const assertions: JSONSchema = {}
  for (const key of siblings) {
    if (key === 'allOf' && Array.isArray(schema.allOf)) {
      members.push(...schema.allOf)
      delete schema.allOf
    } else if (VALIDATION_KEYWORDS.has(key)) {
      assertions[key] = schema[key]
      delete schema[key]
    }
  }
  if (!isEmpty(assertions)) {
    members.push(assertions)
  }
  delete schema.$ref
  schema.allOf = members
})

/**
 * The same copy is made when the siblings are only annotations -- a new object per reference;
 * and downstream, a schema's identity is its type's identity (hence a `Foo1` per documented
 * reference to `Foo`).
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
 * `unevaluatedProperties` next to a `$ref` that no sibling extends (the composing rule above
 * took the other case, keyword and all) would be merged into a copy of the target and, through
 * the normalizer's fold into `additionalProperties`, close that copy: a second declaration of
 * the target's type under the target's name, differing in its index signature. Drop it instead,
 * while the `$ref` is still visible, so the reference resolves to the target itself and the
 * object stays open, as it was before the keyword was supported.
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
 * `$ref`). Only *internal* pointers (`#/...`) are handled here, since those
 * are the only ones affected; a root `$ref` to an external file/URL is left
 * for $RefParser to resolve, as before.
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

    if (!isPlainObject(target)) {
      break // not a plain-object pointer into this document; let $RefParser handle/report it
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

/** Runs the rules over one document (anything else a parser may produce passes through) */
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
  }
  return document
}

/**
 * The schema being compiled gets the rules plus its root `$ref` resolved -- which only the
 * document handed to $RefParser needs; the files it loads get `prenormalizeDocument` alone.
 */
export function prenormalize(schema: JSONSchema): void {
  prenormalizeDocument(schema)
  resolveRootRef(schema)
}
