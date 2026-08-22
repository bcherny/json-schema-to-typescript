import {$RefParser, ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
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
  resolveNamedAnchors(dereferencedSchema)
  return {dereferencedPaths, dereferencedSchema}
}

// A JSON Pointer fragment always starts with "#/" (or is exactly "#"); anything
// else after the "#" is a draft-07 style plain-name anchor.
function isAnchorRef($ref: string): boolean {
  return $ref.startsWith('#') && $ref !== '#' && !$ref.startsWith('#/')
}

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
 * which the rest of the pipeline already knows how to handle.
 */
function resolveNamedAnchors(schema: JSONSchema): void {
  const anchors = new Map<string, JSONSchema>()
  eachSchemaNode(schema, node => {
    if (typeof node.$id === 'string' && isAnchorRef(node.$id) && !anchors.has(node.$id)) {
      anchors.set(node.$id, node)
    }
  })
  if (!anchors.size) {
    return
  }
  eachSchemaNode(schema, (node, replace) => {
    if (typeof node.$ref === 'string' && anchors.has(node.$ref)) {
      replace(anchors.get(node.$ref)!)
    }
  })
}

/**
 * Walks every object/array reachable from `schema`, invoking `visit` on each plain
 * object node. `replace` swaps the node out in its parent container, in place.
 */
function eachSchemaNode(
  schema: unknown,
  visit: (node: JSONSchema, replace: (nextNode: JSONSchema) => void) => void,
  seen = new Set<unknown>(),
  parent?: any,
  key?: string,
): void {
  if (!schema || typeof schema !== 'object' || seen.has(schema)) {
    return
  }
  seen.add(schema)

  if (!Array.isArray(schema)) {
    visit(schema as JSONSchema, nextNode => {
      if (parent) {
        parent[key!] = nextNode
      }
    })
  }

  for (const childKey of Object.keys(schema)) {
    eachSchemaNode((schema as any)[childKey], visit, seen, schema, childKey)
  }
}
