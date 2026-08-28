import {describe, expect, test} from 'bun:test'
import {DEFAULT_OPTIONS, JSONSchema, Options} from '../src'
import {link} from '../src/linker'
import {normalize} from '../src/normalizer'
import {parse, Processed} from '../src/parser'
import type {TIntersection} from '../src/types/AST'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('parser', () => {
  // Every parsed node asks whether it is one of the root schema's definitions. That lookup must not scan
  // all definitions per node (O(definitions × nodes)): schemas with thousands of definitions (OpenAPI
  // model dumps, the CloudFormation resource spec) then spend most of compile() in it.
  test('parse time is linear in the number of definitions', () => {
    const schema: JSONSchema = {definitions: {}}
    for (let i = 0; i < 10_000; i++) {
      schema.definitions![`Def${i}`] = {
        type: 'object',
        properties: {value: {type: 'string'}},
        additionalProperties: false,
      }
    }
    const options: Options = {...DEFAULT_OPTIONS, unreachableDefinitions: true}
    const normalized = normalize(link(schema), new WeakMap(), 'Root', options)
    const start = performance.now()
    parse(normalized, options)
    expect(performance.now() - start).toBeLessThan(5_000)
  })

  // A schema that is both an OBJECT and an ALL_OF parses as an intersection of the two. `parse`
  // meets such a schema once per place that refers to it; every call after the first must hand
  // back the node the first one built, as it built it -- not push the object member on again.
  test('parsing a schema again returns its intersection unchanged', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {a: {type: 'string'}},
      allOf: [{type: 'object', properties: {b: {type: 'string'}}}],
    }
    const normalized = normalize(link(schema), new WeakMap(), 'Root', DEFAULT_OPTIONS)
    const processed: Processed = new Map()
    const first = parse(normalized, DEFAULT_OPTIONS, undefined, processed) as TIntersection
    expect(first.type).toBe('INTERSECTION')
    expect(first.params).toHaveLength(2)
    const second = parse(normalized, DEFAULT_OPTIONS, undefined, processed)
    expect(second).toBe(first)
    expect(first.params).toHaveLength(2)
  })
})
