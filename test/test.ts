import { compile, Settings } from '../src/index'
import { JSONSchema } from '../src/JSONSchema'
import test from 'ava'
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
    .forEach(_ => run(_[1], path.resolve(__dirname, _[0])))
}

interface TestCase {
  configurations?: { settings: Settings, types: string }[]
  error?: { type: ErrorConstructor }
  exclude?: boolean
  schema: JSONSchema
  settings?: Settings
  types?: string
  only?: boolean
}

function run(exports: TestCase, name: string) {
  if (exports.configurations) {
    exports.configurations.forEach((cfg: any) => {
      test(`${name}: ${JSON.stringify(cfg.settings)}`, t => {
        if (cfg.error) {
          t.throws(() => compile(cfg.schema, name, cfg.settings), cfg.error.type)
        } else {
          t.is(compile(exports.schema, name, cfg.settings), cfg.types)
        }
      })
    })
  } else {
    test(name, t => exports.error
      ? t.throws(() => compile(exports.schema, name, exports.settings), exports.error.type)
      : t.is(compile(exports.schema, name, exports.settings), exports.types)
    )
  }
}
