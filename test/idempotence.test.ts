import {describe, expect, test} from 'bun:test'
import {JSONSchema4} from 'json-schema'
import {cloneDeep} from 'lodash'
import {compile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('idempotence', () => {
  const SCHEMA: JSONSchema4 = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
    },
    required: ['firstName'],
  }

  test('compile() should not mutate its input', async () => {
    const before = cloneDeep(SCHEMA)
    await compile(SCHEMA, 'A')
    expect(before).toEqual(SCHEMA)
  })

  test('compile() should not mutate values in its input that JSON could not hold', async () => {
    // e.g. a YAML timestamp; https://github.com/bcherny/json-schema-to-typescript/pull/871
    const at = new Date(0)
    const schema: any = {
      type: 'object',
      properties: {a: {type: 'string', default: at, examples: [at]}},
      'x-at': at,
    }
    await compile(schema, 'A')
    expect(Object.getOwnPropertySymbols(at)).toEqual([])
    await compile(schema, 'A') // threw "Cannot redefine property Symbol(Types)" when `at` was shared with the copy
  })

  test('compile() should be idempotent', async () => {
    const a = await compile(SCHEMA, 'A')
    const b = await compile(SCHEMA, 'A')
    expect(a).toEqual(b)
  })
})
