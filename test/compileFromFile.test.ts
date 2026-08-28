import {describe, expect, test} from 'bun:test'
import {compileFromFile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('compileFromFile', () => {
  test('compileFromFile should fall back to a placeholder name when the file name has no identifier characters', async () =>
    expect(await compileFromFile('./test/resources/DigitsOnlyName/2024.json')).toMatchSnapshot())

  test('compileFromFile should resolve refs from cwd option', async () =>
    expect(
      await compileFromFile('./test/resources/other/ReferencingType.json', {cwd: './test/resources'}),
    ).toMatchSnapshot())

  test('compileFromFile should resolve refs from cwd option as yml', async () =>
    expect(
      await compileFromFile('./test/resources/other/ReferencingType.yml', {cwd: './test/resources'}),
    ).toMatchSnapshot())

  test('compileFromFile should default cwd to the schema directory when no options are passed', async () =>
    expect(await compileFromFile('./test/resources/cwdDefault/schema.json')).toMatchSnapshot())

  test('compileFromFile should default cwd to the schema directory when options is an empty object', async () =>
    expect(await compileFromFile('./test/resources/cwdDefault/schema.json', {})).toMatchSnapshot())
})
