import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {isPlainObject} from 'lodash'
import {JSONSchema} from './types/JSONSchema'
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
  // The root's own keys (besides `$ref`) win over same-named keys pulled in from a
  // resolved target, preserving however this library already treats a `$ref`
  // combined with sibling keywords at the root -- this loop's only job is to stop
  // the root from still being a bare `$ref` by the time $RefParser sees it.
  const originalKeys = new Set(Object.keys(schema).filter(key => key !== '$ref'))

  const seenPointers = new Set<string>()
  while (isPlainObject(schema) && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/')) {
    const pointer = schema.$ref
    if (seenPointers.has(pointer)) {
      break // circular root $ref; let $RefParser report its usual error
    }
    seenPointers.add(pointer)

    const target = pointer
      .slice(2)
      .split('/')
      .reduce<unknown>((node, segment) => {
        if (!isPlainObject(node) && !Array.isArray(node)) {
          return undefined
        }
        const key = decodeURIComponent(segment.replace(/~1/g, '/').replace(/~0/g, '~'))
        return (node as Record<string, unknown>)[key]
      }, documentRoot)

    if (!isPlainObject(target)) {
      break // not a plain-object pointer into this document; let $RefParser handle/report it
    }

    delete schema.$ref
    for (const [key, value] of Object.entries(target as Record<string, unknown>)) {
      if (key === '$ref' || !originalKeys.has(key)) {
        ;(schema as Record<string, unknown>)[key] = value
      }
    }
  }
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
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema}
}
