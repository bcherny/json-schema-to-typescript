import { compile, Options } from '../src/index'
import { JSONSchema } from '../src/JSONSchema'
import { stripExtension } from '../src/utils'
import { diff } from './diff'
import test, { ContextualTestContext } from 'ava'
import { bold, green, red, white } from 'cli-color'
import * as fs from 'fs'
import { find } from 'lodash'
import * as path from 'path'

const dir = __dirname + '/cases'
const modules = fs.readdirSync(dir)
  .filter(_ => /^.*\.js$/.test(_))
  .map(_ => [_, require(path.join(dir, _))]) as [string, TestCase][]

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

interface TestCase {
  configurations?: { settings: Options, types: string }[]
  error?: { type: ErrorConstructor }
  exclude?: boolean
  schema: JSONSchema
  settings?: Options
  types?: string
  only?: boolean
}

function run(exports: TestCase, name: string) {
  if (exports.configurations) {
    exports.configurations.forEach((cfg: any) => {
      const caseName = `${name}: ${JSON.stringify(cfg.settings)}`
      test(caseName, t => {
        if (cfg.error) {
          t.throws(() => compile(cfg.schema, stripExtension(name), cfg.settings), cfg.error.type)
        } else {
          compare(t, caseName, compile(exports.schema, stripExtension(name), cfg.settings) as string, cfg.types)
        }
      })
    })
  } else {
    test(name, t => exports.error
      ? t.throws(() => compile(exports.schema, stripExtension(name), exports.settings), exports.error.type)
      : compare(t, name, compile(exports.schema, stripExtension(name), exports.settings) as string, exports.types as string)
    )
  }
}

function compare(t: ContextualTestContext, caseName: string, a: string, b: string) {
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
