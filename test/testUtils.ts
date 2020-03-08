import {serial as test} from 'ava'
import {pathTransform} from '../src/utils'

export function run() {
  test('validate pathTransform function', t => {
    const inputPaths = ['MultiSchema/foo/a.json', 'MultiSchema/bar/fuzz/c.json', 'MultiSchema/bar/d.json']
    const outputPath = 'MultiSchema/Out'

    t.is(pathTransform(outputPath, inputPaths[0]), 'MultiSchema/Out/foo/a.json')
    t.is(pathTransform(outputPath, inputPaths[1]), 'MultiSchema/Out/bar/fuzz/c.json')
    t.is(pathTransform(outputPath, inputPaths[2]), 'MultiSchema/Out/bar/d.json')
  })
}
