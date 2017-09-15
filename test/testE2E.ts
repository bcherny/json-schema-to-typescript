import { test } from 'ava'
import { readdirSync } from 'fs'
import { find } from 'lodash'
import { join } from 'path'
import { compile, JSONSchema, Options } from '../src'
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
  options?: Options
  output: string
}

interface SingleTestCase extends TestInterface, BaseTestCase {}

interface MultiTestCase extends BaseTestCase {
  outputs: TestInterface[]
}

type TestCase = SingleTestCase | MultiTestCase

export function hasOnly() {
  return readdirSync(dir)
    .filter(_ => /^.*\.js$/.test(_))
    .map(_ => require(join(dir, _)))
    .some(_ => _.only)
}

export function run() {

  // [filename, absolute dirname, contents][]
  const modules = readdirSync(dir)
    .filter(_ => /^.*\.js$/.test(_))
    .map(_ => [_, require(join(dir, _))]) as [string, TestCase][]

  // exporting `const only=true` will only run that test
  // exporting `const exclude=true` will not run that test
  const only = find(modules, _ => Boolean(_[1].only))
  if (only) {
    runOne(only[1], only[0])
  } else {
    modules
      .filter(_ => !_[1].exclude)
      .forEach(_ => runOne(_[1], _[0]))
  }
}

function runOne(exports: TestCase, name: string) {
  log(`Running test: "${name}"`)
  if (isMultiTestCase(exports)) {
    exports.outputs.forEach(_ => {
      const caseName = `${name}: ${JSON.stringify(_.options)}`
      test(caseName, async t => {
        if (_.error) {
          try {
            await compile(exports.input, stripExtension(name), _.options)
          } catch (e) {
            t.true(e instanceof Error)
          }
        } else {
          compare(t, caseName, await compile(exports.input, stripExtension(name), _.options), _.output)
        }
      })
    })
  } else {
    test(name, async t => {
      if (exports.error) {
        try {
          await compile(exports.input, stripExtension(name), exports.options)
        } catch (e) {
          t.true(e instanceof Error)
        }
      } else {
        compare(t, name, await compile(exports.input, stripExtension(name), exports.options), exports.output)
      }
    })
  }
}

function isMultiTestCase(exports: TestCase): exports is MultiTestCase {
  return 'outputs' in exports
}
