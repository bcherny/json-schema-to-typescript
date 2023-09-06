import test from 'ava'
import {JSONSchema4} from 'json-schema'
import {cloneDeep} from 'lodash'
import {compile} from '../src/index.js'

export function run() {
  const SCHEMA: JSONSchema4 = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
    },
    required: ['firstName'],
  }

  test('compile() should not mutate its input', async t => {
    const before = cloneDeep(SCHEMA)
    await compile(SCHEMA, 'A')
    t.deepEqual(before, SCHEMA)
  })

  test('compile() should be idempotent', async t => {
    const a = await compile(SCHEMA, 'A')
    const b = await compile(SCHEMA, 'A')
    t.deepEqual(a, b)
  })
}
