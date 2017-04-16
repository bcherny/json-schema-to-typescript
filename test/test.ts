import test, { AssertContext } from 'ava'
import { bold, green, red, white } from 'cli-color'
import * as fs from 'fs'
import { find } from 'lodash'
import { join } from 'path'
import { compile, Options } from '../src'
import { JSONSchema } from '../src/types/JSONSchema'
import { log, stripExtension } from '../src/utils'
import { diff } from './diff'

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

function run(exports: TestCase, name: string) {
  log(`Running test: "${name}"`)
  if (isMultiTestCase(exports)) {
    exports.outputs.forEach(_ => {
      const caseName = `${name}: ${JSON.stringify(_.settings)}`
      test(caseName, async t => {
        if (_.error) {
          t.throws(async () => await compile(exports.input, stripExtension(name), _.settings))
        } else {
          compare(t, caseName, await compile(exports.input, stripExtension(name), _.settings) as string, _.output)
        }
      })
    })
  } else {
    test(name, async t => exports.error
      ? t.throws(async () => await compile(exports.input, stripExtension(name), exports.settings))
      : compare(t, name, await compile(exports.input, stripExtension(name), exports.settings) as string, exports.output)
    )
  }
}

function isMultiTestCase(exports: TestCase): exports is MultiTestCase {
  return 'outputs' in exports
}

function compare(t: AssertContext, caseName: string, a: string, b: string) {
  if (a !== b) {
    console.log(
      '\n',
      '─────────────────────────────────────────────────────────',
      '\n',
      bold(red(`${caseName} failed`)),
      '\n',
      '\n',
      green('Green') + white(' = Extraneous character in output'),
      '\n',
      '  ' + red('Red') + white(' = Missing character in output'),
      '\n',
      '\n',
      diff(a, b),
      '─────────────────────────────────────────────────────────'
    )
    t.fail()
  } else {
    t.pass()
  }
}

///////////////////////////    e2e    ///////////////////////////

const dir = __dirname + '/e2e'
const modules = fs.readdirSync(dir)
  .filter(_ => /^.*\.js$/.test(_))
  .map(_ => [_, require(join(dir, _))]) as [string, TestCase][]

// exporting `const only=true` will only run that test
// exporting `const exclude=true` will not run that test
const only = find(modules, _ => _[1].only)
if (only) {
  run(only[1], only[0])
} else {
  modules
    .filter(_ => !_[1].exclude)
    .forEach(_ => run(_[1], _[0]))
}

///////////////////////////    normalizer    ///////////////////////////

// TODO: port all test cases to this shape
// interface JSONTestCase {
//   name: string
//   in: JSONSchema
//   out: JSONSchema
// }

// const normalizerDir = `${__dirname}/../../test/normalizer`
// fs.readdirSync(normalizerDir)
//   .filter(_ => /^.*\.json$/.test(_))
//   .map(_ => join(normalizerDir, _))
//   .map(_ => [_, require(_) as JSONTestCase])
//   .forEach(([filename, json]: [string, JSONTestCase]) => {
//     const params = { filename }
//     test(json.name, t =>
//       compare(
//         t,
//         json.name,
//         template(toString(normalize(json.in, filename)))(params),
//         template(toString(json.out))(params)
//       )
//     )
  // })

// function toString(json: Object): string {
//   return JSON.stringify(json, null, 2)
// }
