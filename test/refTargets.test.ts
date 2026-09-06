import {describe, expect, test} from 'bun:test'
import {compile, JSONSchema} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

const options = {cwd: 'test/resources/NotASchema/', bannerComment: ''}

// The error for a `$ref` that should lead to a schema and does not is pinned by the
// test/e2e/refToNonSchema* cases; these pin what must keep compiling.
suite('$ref targets that are not object schemas', () => {
  test('a document that is `true` or `false` is a boolean schema', async () => {
    const schema: JSONSchema = {
      title: 'Booleans',
      type: 'object',
      properties: {anything: {$ref: 'true.json'}, nothing: {$ref: 'false.json'}},
      additionalProperties: false,
    }
    expect(await compile(schema, 'Booleans', options)).toBe(
      'export interface Booleans {\n  anything?: unknown;\n  nothing?: never;\n}\n',
    )
  })

  test('outside schema positions a $ref may lead to anything: a description kept in a Markdown file', async () => {
    const description: unknown = {$ref: 'intro.md'} // (typed as the string it becomes)
    const schema: JSONSchema = {
      title: 'Documented',
      type: 'object',
      properties: {y: {type: 'string', description: description as string}},
      additionalProperties: false,
    }
    const compiled = await compile(schema, 'Documented', options)
    expect(compiled).toContain(' * Some *Markdown* prose, kept in its own file.\n')
    expect(compiled).toContain('  y?: string;\n')
  })
})
