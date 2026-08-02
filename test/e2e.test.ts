import {expect, test} from 'bun:test'
import {compile} from '../src'
import {log, stripExtension} from '../src/utils'
import {getOptions, getTestCases} from './e2eCases'

for (const [name, testCase] of getTestCases()) {
  log('blue', 'Running test', name)

  test(name, async () => {
    const options = getOptions(testCase)
    if (testCase.error) {
      await expect(compile(testCase.input, stripExtension(name), options)).rejects.toBeInstanceOf(Error)
    } else {
      expect(await compile(testCase.input, stripExtension(name), options)).toMatchSnapshot()
    }
  })
}
