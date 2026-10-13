import {describe, expect, test} from 'bun:test'
import {spawnSync} from 'child_process'
import {resolve} from 'path'
import {compile, JSONSchema} from '../src'
import {link} from '../src/linker'
import {validate} from '../src/validator'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe
const invalid = {type: 'asd'} as unknown as JSONSchema

suite('rejectInvalidTypes', () => {
  test('is opt-in and reports the invalid property', async () => {
    const schema = {type: 'object', properties: {lastName: invalid}} as JSONSchema
    expect(validate(link(schema), 'person.json')).toEqual([])
    expect(validate(link(schema), 'person.json', true)).toEqual([
      'Error at key "lastName" in file "person.json": type must be a JSON Schema primitive type or a non-empty array of primitive types',
    ])
    await expect(compile(schema, 'Person')).resolves.toContain('lastName')
    await expect(compile(schema, 'Person', {rejectInvalidTypes: false})).resolves.toContain('lastName')
    await expect(compile(schema, 'Person', {rejectInvalidTypes: true})).rejects.toThrow()
  })

  test.each([['asd'], ['string', 'asd'], [], [null], [1], [true]].map(type => [type]))(
    'rejects invalid type array %j',
    async type => {
      await expect(compile({type} as unknown as JSONSchema, 'Invalid', {rejectInvalidTypes: true})).rejects.toThrow()
    },
  )

  test.each([null, 1, true, {}])('rejects invalid scalar type %j', async type => {
    await expect(compile({type} as unknown as JSONSchema, 'Invalid', {rejectInvalidTypes: true})).rejects.toThrow()
  })

  test('accepts every primitive and a valid union', async () => {
    for (const type of ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']) {
      await expect(compile({type} as JSONSchema, 'Valid', {rejectInvalidTypes: true})).resolves.toBeString()
    }
    await expect(compile({type: ['string', 'null']}, 'Valid', {rejectInvalidTypes: true})).resolves.toContain(
      'string | null',
    )
  })

  test('checks referenced and composed subschemas', async () => {
    for (const schema of [
      {$ref: '#/definitions/Bad', definitions: {Bad: invalid}},
      {anyOf: [{type: 'string'}, invalid]},
      {type: 'array', items: invalid},
      {type: 'object', additionalProperties: invalid},
    ]) {
      await expect(compile(schema as JSONSchema, 'Invalid', {rejectInvalidTypes: true})).rejects.toThrow()
    }
  })

  test.each([true, false])(
    'does not change legitimate unconstrained output when unknownAny is %j',
    async unknownAny => {
      for (const schema of [
        {},
        {type: 'object'},
        {type: 'array'},
        {enum: ['a', 'b']},
        {type: 'string', format: 'custom'},
      ]) {
        const options = {unknownAny, bannerComment: ''}
        expect(await compile(schema as JSONSchema, 'Valid', {...options, rejectInvalidTypes: true})).toBe(
          await compile(schema as JSONSchema, 'Valid', options),
        )
      }
      await expect(compile(invalid, 'Invalid', {unknownAny, rejectInvalidTypes: true})).rejects.toThrow()
    },
  )

  test('does not validate instance data as subschemas', async () => {
    for (const schema of [{enum: [{type: 'asd'}]}, {type: 'object', default: {type: 'asd'}}, {const: {type: 'asd'}}]) {
      await expect(compile(schema as JSONSchema, 'Valid', {rejectInvalidTypes: true})).resolves.toBeString()
    }
  })

  test('CLI flag rejects invalid types and can be disabled', () => {
    const cli = resolve('dist/src/cli.js')
    const input = JSON.stringify(invalid)
    const rejected = spawnSync('node', [cli, '--rejectInvalidTypes'], {input, encoding: 'utf8'})
    expect(rejected.status).toBe(1)
    expect(rejected.stdout).toBe('')
    expect(rejected.stderr).toContain('type must be a JSON Schema primitive type')
    for (const flags of [[], ['--no-rejectInvalidTypes']]) {
      const accepted = spawnSync('node', [cli, ...flags], {input, encoding: 'utf8'})
      expect(accepted.status).toBe(0)
      expect(accepted.stdout).toContain('unknown')
    }
  })

  test('rejects non-boolean option values', async () => {
    await expect(compile({}, 'Valid', {rejectInvalidTypes: 'true'} as never)).rejects.toThrow(
      'Expected options.rejectInvalidTypes to be a boolean',
    )
  })
})
