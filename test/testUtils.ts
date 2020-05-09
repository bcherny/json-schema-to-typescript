import {serial as test} from 'ava'
import {pathTransform, generateName} from '../src/utils'

export function run() {
  test('pathTransform', t => {
    t.is(pathTransform('types', 'schemas', 'schemas/foo/a.json'), 'types/foo')
    t.is(pathTransform('./schemas/types', './schemas', 'schemas/foo/bar/a.json'), 'schemas/types/foo/bar')
    t.is(pathTransform('types', './src/../types/../schemas', 'schemas/foo/a.json'), 'types/foo')
  })
  test('generateName', t => {
    const usedNames = new Set<string>()
    t.is(generateName('a', usedNames), 'A')
    t.is(generateName('abc', usedNames), 'Abc')
    t.is(generateName('ABcd', usedNames), 'ABcd')
    t.is(generateName('$Abc_123', usedNames), '$Abc_123')
    t.is(generateName('Abc-de-f', usedNames), 'AbcDeF')

    // Index should increment:
    t.is(generateName('a', usedNames), 'A1')
    t.is(generateName('a', usedNames), 'A2')
    t.is(generateName('a', usedNames), 'A3')
  })
}
