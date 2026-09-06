import {describe, expect, test} from 'bun:test'
import {$RefParser} from '@apidevtools/json-schema-ref-parser'
import {cloneDeep} from 'lodash'
import {prenormalize} from '../src/prenormalizer'
import {IdScopeMask, dereferenceInDocument, inDocumentTargets} from '../src/resolver'
import {JSONSchema} from '../src/types/JSONSchema'
import {getTestCases, hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

// Documents the e2e cases don't happen to contain, where doing the obvious thing differs from $RefParser
const CORNER_CASES: Record<string, {input: JSONSchema}> = {
  // a sibling keyword named like an Array.prototype member, next to a `$ref` whose (cached) target is an
  // array: $RefParser drops it (`'length' in []`), so the in-document path has to as well
  'sibling named like an array method': {
    input: {
      definitions: {tup: {items: [{type: 'string'}]}},
      properties: {
        a: {items: {$ref: '#/definitions/tup/items'}},
        c: {items: {$ref: '#/definitions/tup/items', length: 5}},
      },
    },
  },
  // `$id` names a type here, and never rebases the pointers below it -- which $RefParser (16+) would do,
  // and then not find `definitions`, in a document whose root declares a draft `$schema` or an `$id`
  'pointer from under a nested $id': {
    input: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: 'https://example.com/root.json',
      definitions: {shared: {type: 'string'}},
      properties: {named: {$id: 'Named', type: 'object', properties: {s: {$ref: '#/definitions/shared'}}}},
    },
  },
}

suite('resolver', () => {
  // The in-document path exists only to be faster than $RefParser, so it has to produce exactly what
  // $RefParser produces: the same object graph (keys in the same order, the same objects shared or
  // copied in the same places, cycles included) and the same onDereference reports
  test('documents dereferenced in-process come out exactly as $RefParser makes them', async () => {
    let inDocument = 0
    for (const [name, {input}] of [...getTestCases(), ...Object.entries(CORNER_CASES)]) {
      const ours = prepare(input)
      const targets = inDocumentTargets(ours.schema)
      if (!targets) {
        continue // one for $RefParser either way
      }
      inDocument++
      dereferenceInDocument(ours.schema, targets, ours.onDereference)
      const theirs = prepare(input)
      const documents = new IdScopeMask() // as `dereference()` hands documents to $RefParser
      await new $RefParser().dereference(__dirname + '/', documents.hide(theirs.schema), {
        dereference: {onDereference: theirs.onDereference},
      })
      documents.restore()
      expect(firstDifference(ours.schema, theirs.schema, ours.reported, theirs.reported), name).toBe(undefined)
    }
    expect(inDocument).toBeGreaterThan(150) // most of them
  })
})

/** A fresh copy of a test's input as `dereference()` gets it, and a record of what onDereference was told */
function prepare(input: JSONSchema) {
  const schema = cloneDeep(input)
  prenormalize(schema)
  const reported = new Map<unknown, string>()
  return {schema, reported, onDereference: ($ref: string, target: unknown) => void reported.set(target, $ref)}
}

/** Walks two object graphs in parallel; describes the first place they differ, if any */
function firstDifference(
  a: any,
  b: any,
  aPaths: Map<unknown, string>,
  bPaths: Map<unknown, string>,
  counterpart = new Map<unknown, unknown>(), // a's objects to b's, and b's to a's
  path = '#',
): string | undefined {
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return Object.is(a, b) ? undefined : `${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`
  }
  if (counterpart.has(a) || counterpart.has(b)) {
    return counterpart.get(a) === b && counterpart.get(b) === a ? undefined : `${path}: shared on one side only`
  }
  counterpart.set(a, b).set(b, a)
  if (Array.isArray(a) !== Array.isArray(b)) {
    return `${path}: array vs object`
  }
  if (aPaths.get(a) !== bPaths.get(b)) {
    return `${path}: onDereference reported ${aPaths.get(a)} vs ${bPaths.get(b)}`
  }
  const keys = Object.keys(a)
  if (keys.join('\n') !== Object.keys(b).join('\n')) {
    return `${path}: keys ${keys} vs ${Object.keys(b)}`
  }
  for (const key of keys) {
    const difference = firstDifference(a[key], b[key], aPaths, bPaths, counterpart, `${path}/${key}`)
    if (difference !== undefined) {
      return difference
    }
  }
}
