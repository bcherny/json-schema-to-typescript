import {
  $RefParser,
  FileInfo,
  ParserOptions as $RefOptions,
  Plugin,
  getJsonSchemaRefParserDefaultOptions,
} from '@apidevtools/json-schema-ref-parser'
import {isPlainObject} from 'lodash'
import {prenormalizeDocument} from './prenormalizer'
import {DefinitionKey, JSONSchema} from './types/JSONSchema'
import {eachSchemaNode, log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const externalDocuments = new Set<JSONSchema>()
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    parse: prenormalizingParsers($refOptions.parse),
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        dereferencedPaths.set(schema, $ref)
        if (isWholeDocumentRef($ref)) {
          externalDocuments.add(schema)
        }
      },
    },
  })) as any // TODO: fix types
  tagExternalDefinitions(externalDocuments, dereferencedSchema)
  return {dereferencedPaths, dereferencedSchema: resolveNamedAnchors(dereferencedSchema)}
}

/** `other.json`, `other.json#`, `http://x/y.json#/`: a $ref to a separate document as a whole */
function isWholeDocumentRef($ref: string): boolean {
  const hash = $ref.indexOf('#')
  const fragment = hash === -1 ? '' : $ref.slice(hash + 1)
  return hash !== 0 && (fragment === '' || fragment === '/')
}

/**
 * A schema brought in by a $ref to a separate document keeps its own `definitions`/`$defs`,
 * but once dereferenced into the referencing document that map sits somewhere below the
 * root, where the parser does not look for names. Record on each of its entries the key it
 * is held under, so the parser names it as it would when compiling that document on its
 * own (see #143). Only documents referenced as a whole are considered; a definition reached
 * solely through `file.json#/definitions/X` pointers is named as before.
 */
function tagExternalDefinitions(documents: Set<JSONSchema>, rootSchema: JSONSchema) {
  const rootDefinitions = {...rootSchema.definitions, ...rootSchema.$defs}
  for (const document of documents) {
    if (!isPlainObject(document) || document === rootSchema) {
      continue
    }
    const {$defs, definitions} = document
    for (const [key, entry] of [...Object.entries($defs ?? {}), ...Object.entries(definitions ?? {})]) {
      // A name the document being compiled defines itself stays that definition's alone:
      // another file's entry under the same key is left unnamed (inlined, as before)
      // rather than taking the name or a numbered variant of it, depending on visit order.
      if (
        Object.prototype.hasOwnProperty.call(rootDefinitions, key) ||
        !isPlainObject(entry) ||
        Object.prototype.hasOwnProperty.call(entry, DefinitionKey)
      ) {
        continue
      }
      Object.defineProperty(entry, DefinitionKey, {enumerable: false, value: key, writable: false})
    }
  }
}

/**
 * Returns the parsers in effect (the ref-parser's defaults overlaid with the caller's
 * `$refOptions.parse`) with each `parse` wrapped, so that every file loaded through a `$ref`
 * gets the same pre-dereference rewrites as the schema being compiled, before its own
 * `$ref`s are resolved.
 */
function prenormalizingParsers(configured: $RefOptions['parse'] = {}): $RefOptions['parse'] {
  const defaults = getJsonSchemaRefParserDefaultOptions().parse
  const parsers: $RefOptions['parse'] = {...defaults, ...configured}
  for (const [name, options] of Object.entries(parsers)) {
    const plugin = typeof options === 'object' ? {...(defaults[name] as Plugin | undefined), ...options} : undefined
    const parse = plugin?.parse
    if (typeof parse !== 'function') {
      continue // disabled (`false`), or left entirely to the defaults (`true`)
    }
    parsers[name] = {
      ...plugin,
      // A parser may return its result (or a promise of it), or hand it to `callback`. (Not
      // `parse.call`: the ref-parser passes a third argument the `Plugin` type leaves out.)
      parse(this: Plugin, file: FileInfo, callback?: ParserCallback, ...rest: unknown[]) {
        const tap: ParserCallback | undefined =
          callback && ((error, data) => callback(error, prenormalizeDocument(data)))
        const result: unknown = Reflect.apply(parse, this, [file, tap, ...rest])
        return isThenable(result) ? result.then(prenormalizeDocument) : prenormalizeDocument(result)
      },
    }
  }
  return parsers
}

type ParserCallback = (error: Error | null, data: any) => any

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown>)?.then === 'function'
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
