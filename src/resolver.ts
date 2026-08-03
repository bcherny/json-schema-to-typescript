import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {isPlainObject} from 'lodash'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

/**
 * $RefParser (as of 11.9.3) can't correctly dereference a root-level `$ref`
 * whose target itself contains a further `$ref`: it loses track of where the
 * root schema "moved" to while re-crawling, and leaves a malformed, still-`$ref`
 * schema behind instead of resolving it.
 * See https://github.com/bcherny/json-schema-to-typescript/issues/132
 *
 * Work around this by resolving the schema's own top-level `$ref` chain
 * ourselves first -- a plain, single-hop, in-document JSON Pointer lookup --
 * before handing the schema off to $RefParser to resolve everything else.
 * Only *internal* pointers (`#/...`) are handled here, since those are the
 * only ones affected; a root `$ref` to an external file/URL is unaffected by
 * this bug and is left for $RefParser to resolve, as before.
 */
function resolveRootRef(schema: JSONSchema): void {
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
        if (node === null || typeof node !== 'object') {
          return undefined
        }
        const key = decodeURIComponent(segment.replace(/~1/g, '/').replace(/~0/g, '~'))
        return (node as Record<string, unknown>)[key]
      }, schema)

    if (!isPlainObject(target)) {
      break // not a plain-object pointer into this document; let $RefParser handle/report it
    }

    delete schema.$ref
    Object.assign(schema, target)
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
