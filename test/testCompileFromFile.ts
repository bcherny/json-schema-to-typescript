import test from 'ava'
import {compileFromFile} from '../src'

export function run() {
  test('compileFromFile should resolve refs from cwd option', async t =>
    t.snapshot(await compileFromFile('./other/ReferencingType.json', {cwd: './test/resources'})))
}
