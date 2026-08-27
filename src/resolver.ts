import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {isPlainObject} from 'lodash'
import {ExternallyReferenced, JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

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

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  resolveRootRef(schema)

  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        dereferencedPaths.set(schema, $ref)
        // A $ref into a separate file (as opposed to a `#/...` pointer within
        // the current document) brings in a schema that keeps its own
        // `definitions`/`$defs` map, wherever it ends up nested once merged
        // into the referencing document. Mark its root so standaloneName()
        // can still find named definitions living inside it (see #143).
        if (!$ref.startsWith('#') && !Object.prototype.hasOwnProperty.call(schema, ExternallyReferenced)) {
          Object.defineProperty(schema, ExternallyReferenced, {
            enumerable: false,
            value: true,
            writable: false,
          })
        }
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema: resolveNamedAnchors(dereferencedSchema)}
}

// A JSON Pointer fragment always starts with "#/" (or is exactly "#"); anything
// else after the "#" is a draft-07 style plain-name anchor.
function isAnchorRef($ref: string): boolean {
  return $ref.startsWith('#') && $ref !== '#' && !$ref.startsWith('#/')
}

// These keywords hold plain data, never a nested schema, so `$id`/`$ref` found
// underneath them must not be treated as anchors/anchor-refs.
const NON_SCHEMA_KEYS = new Set(['enum', 'const', 'default', 'examples'])

/**
 * @apidevtools/json-schema-ref-parser only resolves `$ref`s that are JSON Pointers
 * (`#/...`). It has no support for draft-07 style named anchors, where a subschema
 * declares `$id: "#name"` and other parts of the document reference it via
 * `$ref: "#name"` -- those `$ref`s are left completely untouched by the parser
 * (@see https://github.com/APIDevTools/json-schema-ref-parser/issues/97), and would
 * otherwise crash the parser downstream.
 *
 * Find every such anchor in the already-dereferenced schema, and rewrite any matching
 * `$ref` in place to point at the same schema node -- the same substitution the
 * ref-parser itself performs for an ordinary (possibly circular) JSON Pointer `$ref`,
 * which the rest of the pipeline already knows how to handle. Returns the (possibly
 * new) root schema, in case the root itself was a named-anchor `$ref`.
 */
function resolveNamedAnchors(schema: JSONSchema): JSONSchema {
  const anchors = new Map<string, JSONSchema>()
  eachSchemaNode(schema, node => {
    if (typeof node.$id === 'string' && isAnchorRef(node.$id) && !anchors.has(node.$id)) {
      anchors.set(node.$id, node)
    }
  })
  if (!anchors.size) {
    return schema
  }

  // An anchor's own node can itself be an alias for another anchor
  // (`$id: "#b", $ref: "#a"`); follow those chains up front so every map entry
  // ends up pointing at a concrete (non-`$ref`) node.
  function resolveChain($ref: string, seen = new Set<string>()): JSONSchema {
    const node = anchors.get($ref)!
    if (typeof node.$ref === 'string' && anchors.has(node.$ref) && !seen.has($ref)) {
      return resolveChain(node.$ref, seen.add($ref))
    }
    return node
  }
  for (const name of anchors.keys()) {
    anchors.set(name, resolveChain(name))
  }

  let resolvedRoot = schema
  eachSchemaNode(schema, (node, replace) => {
    if (typeof node.$ref === 'string' && anchors.has(node.$ref)) {
      const target = anchors.get(node.$ref)!
      if (node === schema) {
        resolvedRoot = target
      }
      replace(target)
    }
  })
  return resolvedRoot
}

/**
 * Walks every object/array reachable from `schema`, invoking `visit` on each plain
 * object node found in a schema-bearing position. `replace` swaps the node out in
 * its parent container, in place (a no-op for the root node, which has no parent).
 *
 * The same node object can be reachable from more than one parent/key (eg. two
 * schemas sharing a `$ref` node via a YAML alias, or a node the ref-parser already
 * folded into a cycle), so `visit` runs for every occurrence. Only the recursion
 * into a node's children is guarded against repeating -- via `seen` -- to keep
 * cycles from looping forever.
 */
function eachSchemaNode(
  schema: unknown,
  visit: (node: JSONSchema, replace: (nextNode: JSONSchema) => void) => void,
  seen = new Set<unknown>(),
  parent?: any,
  key?: string,
): void {
  if (!schema || typeof schema !== 'object') {
    return
  }

  if (!Array.isArray(schema)) {
    visit(schema as JSONSchema, nextNode => {
      if (parent) {
        parent[key!] = nextNode
      }
    })
  }

  if (seen.has(schema)) {
    return
  }
  seen.add(schema)

  for (const childKey of Object.keys(schema)) {
    if (NON_SCHEMA_KEYS.has(childKey)) {
      continue
    }
    eachSchemaNode((schema as any)[childKey], visit, seen, schema, childKey)
  }
}
