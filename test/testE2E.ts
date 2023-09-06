import $RefParser from '@bcherny/json-schema-ref-parser'
import test from 'ava'
import {readdirSync} from 'fs'
import {find, merge} from 'lodash'
import {join} from 'path'
import {compile, JSONSchema, Options} from '../src/index.js'
import {log, stripExtension} from '../src/utils.js'
import {getWithCache} from './http.js'

const dir = __dirname + '/e2e'

type TestCase = {
  input: JSONSchema
  error?: true
  exclude?: boolean
  only?: boolean
  options?: Options
}

export function hasOnly() {
  return readdirSync(dir)
    .filter(_ => /^.*\.js$/.test(_))
    .map(_ => require(join(dir, _)))
    .some(_ => _.only)
}

export function run() {
  // [filename, absolute dirname, contents][]
  const modules = readdirSync(dir)
    .filter(_ => !_.includes('.ignore.'))
    .filter(_ => /^.*\.js$/.test(_))
    .map(_ => [_, require(join(dir, _))]) as [string, TestCase][]

  // exporting `const only=true` will only run that test
  // exporting `const exclude=true` will not run that test
  const only = find(modules, _ => Boolean(_[1].only))
  if (only) {
    runOne(only[1], only[0])
  } else {
    modules.filter(_ => !_[1].exclude).forEach(_ => runOne(_[1], _[0]))
  }
}

const httpWithCacheResolver = {
  order: 1,
  canRead: /^https?:/i,
  async read({url}: $RefParser.FileInfo) {
    return await getWithCache(url)
  },
}

function runOne(exports: TestCase, name: string) {
  log('blue', 'Running test', name)

  const options = merge(exports.options, {$refOptions: {resolve: {http: httpWithCacheResolver}}})

  test(name, async t => {
    if (exports.error) {
      try {
        await compile(exports.input, stripExtension(name), options)
      } catch (e) {
        t.true(e instanceof Error)
      }
    } else {
      t.snapshot(
        await compile(exports.input, stripExtension(name), options),
        `Expected output to match snapshot for e2e test: ${name}`,
      )
    }
  })
}
