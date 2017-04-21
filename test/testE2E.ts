import { test } from 'ava'
import { readdirSync } from 'fs'
import { find } from 'lodash'
import { dirname, join } from 'path'
import { compile, JSONSchema, Options, ValidationError } from '../src'
import { log, stripExtension } from '../src/utils'
import { compare } from './reporter'

const dir = __dirname + '/e2e'

interface BaseTestCase {
  input: JSONSchema
  exclude?: boolean
  only?: boolean
}

interface TestInterface {
  error?: true
  output: string
  settings?: Options
}

interface SingleTestCase extends TestInterface, BaseTestCase {}

interface MultiTestCase extends BaseTestCase {
  outputs: TestInterface[]
}

type TestCase = SingleTestCase | MultiTestCase

export function run() {

  // [filename, absolute dirname, contents][]
  const modules = readdirSync(dir)
    .filter(_ => /^.*\.js$/.test(_))
    .map(_ => [_, dirname(join(dir, _)), require(join(dir, _))]) as [string, string, TestCase][]

  // exporting `const only=true` will only run that test
  // exporting `const exclude=true` will not run that test
  const only = find(modules, _ => _[2].only)
  if (only) {
    runOne(only[2], only[0], only[1])
  } else {
    modules
      .filter(_ => !_[2].exclude)
      .forEach(_ => runOne(_[2], _[0], _[1]))
  }
}

function runOne(exports: TestCase, name: string, dirname: string) {
  log(`Running test: "${name}"`)
  if (isMultiTestCase(exports)) {
    exports.outputs.forEach(_ => {
      const settings = {..._.settings, cwd: dirname }
      const caseName = `${name}: ${JSON.stringify(_.settings)}`
      test(caseName, async t => {
        if (_.error) {
          try {
            await compile(exports.input, stripExtension(name), settings)
          } catch (e) {
            t.true(e instanceof ValidationError)
          }
        } else {
          compare(t, caseName, await compile(exports.input, stripExtension(name), settings), _.output)
        }
      })
    })
  } else {
    const settings = { ...exports.settings, cwd: dirname }
    test(name, async t => {
      if (exports.error) {
        try {
          await compile(exports.input, stripExtension(name), settings)
        } catch (e) {
          t.true(e instanceof ValidationError)
        }
      } else {
        compare(t, name, await compile(exports.input, stripExtension(name), settings), exports.output)
      }
    })
  }
}

function isMultiTestCase(exports: TestCase): exports is MultiTestCase {
  return 'outputs' in exports
}
