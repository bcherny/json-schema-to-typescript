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

suite('$ref targets that are arrays', () => {
  test('a list of schemas where `items` may hold one, a list of names in `dependencies`', async () => {
    const schema: JSONSchema = {
      title: 'Lists',
      type: 'object',
      definitions: {pair: {items: [{type: 'string'}, {type: 'number'}]}},
      properties: {
        pair: {type: 'array', items: {$ref: '#/definitions/pair/items'}},
        a: {type: 'string'},
        b: {type: 'string'},
      },
      dependencies: {b: {$ref: '#/required'} as unknown as string[]},
      required: ['a'],
      additionalProperties: false,
    }
    expect(await compile(schema, 'Lists', options)).toBe(
      'export interface Lists {\n  pair?: [] | [string] | [string, number, ...unknown[]];\n  a: string;\n  b?: string;\n}\n',
    )
  })

  test('looking the root `$ref` up leaves `continueOnError` nothing to collect', async () => {
    // A named anchor the ref-parser cannot resolve (it is resolved after dereferencing), at the root
    const schema: JSONSchema = {$ref: '#unit', definitions: {unit: {$id: '#unit', type: 'string'}}}
    expect(await compile(schema, 'Unit', {...options, $refOptions: {continueOnError: true}})).toBe(
      'export type Unit = string;\n',
    )
  })

  test('outside schema positions: an `enum` or `examples` list kept under a definition', async () => {
    const list: unknown = {$ref: '#/definitions/unit/enum'} // (typed as the list it becomes)
    const schema: JSONSchema = {
      title: 'Units',
      type: 'object',
      definitions: {unit: {type: 'string', enum: ['metres', 'feet'], examples: ['metres']}},
      properties: {
        y: {
          type: 'string',
          enum: list as string[],
          examples: {$ref: '#/definitions/unit/examples'} as unknown as string[],
        },
      },
      additionalProperties: false,
    }
    expect(await compile(schema, 'Units', options)).toBe('export interface Units {\n  y?: "metres" | "feet";\n}\n')
  })
})
