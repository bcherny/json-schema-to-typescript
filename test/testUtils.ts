import {serial as test} from 'ava'
import {pathTransform, generateName} from '../src/utils'

export function run() {
  test('pathTransform', t => {
    const inputPaths = ['MultiSchema/foo/a.json', 'MultiSchema/bar/fuzz/c.json', 'MultiSchema/bar/d.json']
    const outputPath = 'MultiSchema/Out'

    t.is(pathTransform(outputPath, inputPaths[0]), 'MultiSchema/Out/foo/a.json')
    t.is(pathTransform(outputPath, inputPaths[1]), 'MultiSchema/Out/bar/fuzz/c.json')
    t.is(pathTransform(outputPath, inputPaths[2]), 'MultiSchema/Out/bar/d.json')
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
