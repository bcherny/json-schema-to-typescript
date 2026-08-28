import {isPlainObject} from 'lodash'
import {JSONSchema, LinkedJSONSchema} from './types/JSONSchema'
import {hasType, traverse} from './utils'

/**
 * Rewrites that have to happen on the raw document, before it goes to the ref-parser --
 * each rule below says why it cannot wait for the normalizer. Rules work on plain JSON
 * (there is no `Parent` link yet) and change the schema in place.
 */
type Rule = (schema: JSONSchema) => void
const rules = new Map<string, Rule>()

// Keywords that describe the property or definition rather than its values (or that host
// other schemas), so they stay on the outer schema when `nullable` moves everything else
// into an `anyOf`
const NULLABLE_OUTER_KEYS = new Set(['$defs', '$id', '$schema', 'definitions', 'deprecated', 'description', 'title'])

/**
 * OpenAPI 3.0 `nullable: true` becomes `anyOf: [<schema>, {type: 'null'}]`, which the
 * parser already turns into `X | null` for every shape of schema (typed or untyped,
 * enum, const, allOf, array...). Schemas whose `type` or `enum` already allow null, and
 * schemas that constrain nothing (only annotations next to `nullable`), are left as they
 * are. The schema is rewritten in place, so every reference to it sees the union.
 *
 * `enumName` matters only to the normalizer's `nullable` rule, by which time `tsEnumNames`
 * have been inferred: a TypeScript enum (`enum` + `tsEnumNames`) cannot be an anonymous
 * union member, so it takes its `title` with it, or else is named after `enumName` (the
 * key or definition it sits under) - the name the parser would have given it in place.
 *
 * Returns the schema that moved into the `anyOf`, if any.
 */
export function normalizeNullable(schema: JSONSchema, enumName?: string): JSONSchema | undefined {
  if (schema.nullable !== true || Object.keys(schema).every(_ => _ === 'nullable' || NULLABLE_OUTER_KEYS.has(_))) {
    return
  }
  delete schema.nullable
  if (hasType(schema, 'null') || (Array.isArray(schema.enum) && schema.enum.includes(null))) {
    return
  }
  const isNamedEnum = 'enum' in schema && 'tsEnumNames' in schema
  const inner: JSONSchema = {}
  for (const key of Object.keys(schema)) {
    if (!NULLABLE_OUTER_KEYS.has(key) || (isNamedEnum && key === 'title')) {
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

export function prenormalize(schema: JSONSchema): void {
  // `traverse` reads no `Parent` links, so the raw document is fine despite its parameter type
  rules.forEach(rule => traverse(schema as LinkedJSONSchema, rule))
  resolveRootRef(schema)
}
