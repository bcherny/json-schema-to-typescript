import {describe, expect, test} from 'bun:test'
import {DEFAULT_OPTIONS, JSONSchema, Options} from '../src'
import {link} from '../src/linker'
import {normalize} from '../src/normalizer'
import {parse} from '../src/parser'
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
})
