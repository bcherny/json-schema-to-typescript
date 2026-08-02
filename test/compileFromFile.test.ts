import {describe, expect, test} from 'bun:test'
import {compileFromFile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('compileFromFile', () => {
  test('compileFromFile should resolve refs from cwd option', async () =>
    expect(
      await compileFromFile('./test/resources/other/ReferencingType.json', {cwd: './test/resources'}),
    ).toMatchSnapshot())

  test('compileFromFile should resolve refs from cwd option as yml', async () =>
    expect(
      await compileFromFile('./test/resources/other/ReferencingType.yml', {cwd: './test/resources'}),
    ).toMatchSnapshot())
})
