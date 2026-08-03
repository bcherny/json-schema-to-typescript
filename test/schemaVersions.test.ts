import {describe, expect, test} from 'bun:test'
import {JSONSchema4, JSONSchema6, JSONSchema7} from 'json-schema'
import {compile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

// Regression test for https://github.com/bcherny/json-schema-to-typescript/issues/359:
// compile()'s `schema` parameter must accept JSONSchema4, JSONSchema6, and JSONSchema7.
// Draft-06+ types exclusiveMinimum/exclusiveMaximum as numbers, which isn't assignable
// to draft-04's boolean type -- if compile()'s signature regresses to JSONSchema4 only,
// this file fails `npm run typecheck` even before any assertion below runs.
suite('compile() accepts schemas from any supported JSON Schema draft', () => {
  test('JSONSchema4', async () => {
    const schema: JSONSchema4 = {type: 'number', exclusiveMaximum: true, maximum: 10}
    expect(await compile(schema, 'Test')).toContain('export type Test = number')
  })

  test('JSONSchema6', async () => {
    const schema: JSONSchema6 = {type: 'number', exclusiveMaximum: 10}
    expect(await compile(schema, 'Test')).toContain('export type Test = number')
  })

  test('JSONSchema7', async () => {
    const schema: JSONSchema7 = {type: 'number', exclusiveMaximum: 10}
    expect(await compile(schema, 'Test')).toContain('export type Test = number')
  })
})
