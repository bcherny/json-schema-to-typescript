import {expect, test} from 'bun:test'
import {compile} from '../src'
import {log, stripExtension} from '../src/utils'
import {compileTestCase} from './compilePool'
import {getOptions, getTestCases} from './e2eCases'

for (const [name, testCase] of getTestCases()) {
  log('blue', 'Running test', name)

  test(name, async () => {
    if (testCase.error) {
      await expect(compile(testCase.input, stripExtension(name), getOptions(testCase))).rejects.toBeInstanceOf(Error)
    } else {
      expect(await compileTestCase(name)).toMatchSnapshot()
    }
  })
}
