import {describe, expect, test} from 'bun:test'
import {compile, compileFromFile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('compileFromFile', () => {
  test('compileFromFile should resolve refs from cwd option', async () =>
    expect(
      await compileFromFile('./test/resources/other/ReferencingType.json', {cwd: './test/resources'}),
    ).toMatchSnapshot())

  test('compileFromFile should hoist named definitions reached through an external file $ref (#143)', async () =>
    expect(
      await compileFromFile('./test/resources/other/array.schema.json', {cwd: './test/resources/other'}),
    ).toMatchSnapshot())

  test('definitions in an external file are named the same whichever $ref to that file is visited first', async () => {
    const price = {$ref: 'money.schema.json#/definitions/Money'}
    const whole = {$ref: 'money.schema.json'}
    for (const properties of [
      {price, whole},
      {whole, price},
    ]) {
      const ts = await compile({title: 'Root', type: 'object', properties}, 'Root', {cwd: './test/resources/other'})
      expect(ts).toContain('export type Currency = ')
      expect(ts).toContain('currency?: Currency')
    }
  })

  test('compileFromFile should resolve refs from cwd option as yml', async () =>
    expect(
      await compileFromFile('./test/resources/other/ReferencingType.yml', {cwd: './test/resources'}),
    ).toMatchSnapshot())
})
