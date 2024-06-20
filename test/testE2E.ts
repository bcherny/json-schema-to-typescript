import type {FileInfo} from '@apidevtools/json-schema-ref-parser'
import test from 'ava'
import {readdirSync} from 'fs'
import {find, merge, zip} from 'lodash-es'
import {basename, dirname, join, resolve} from 'path'
import {compile, JSONSchema, Options} from '../src/index.js'
import {log, stripExtension} from '../src/utils.js'
import {getWithCache} from './http.js'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const E2E_TEST_DIR = resolve(__dirname, './e2e')

type TestCase = {
  input: JSONSchema
  error?: true
  exclude?: boolean
  only?: boolean
  options?: Options
}

export async function hasOnly(): Promise<boolean> {
  const files = await Promise.all(
    readdirSync(E2E_TEST_DIR)
      .filter(_ => /^.*\.js$/.test(_))
      .map(_ => join(E2E_TEST_DIR, _))
      .map(_ => import(_)),
  )
  return files.some(_ => _.only)
}

export async function run() {
  // [filename, absolute dirname, contents][]
  const filenames = readdirSync(E2E_TEST_DIR)
    .filter(_ => !_.includes('.ignore.'))
    .filter(_ => /^.*\.js$/.test(_))
    .map(_ => resolve(E2E_TEST_DIR, _))
  const files = await Promise.all(filenames.map(_ => import(_) as Promise<TestCase>))
  const modules = zip(
    filenames.map(_ => basename(_)),
    files,
  )

  // exporting `const only=true` will only run that test
  // exporting `const exclude=true` will not run that test
  const only = find(modules, _ => Boolean(_[1]!.only))
  if (only) {
    runOne(only[1]!, only[0]!)
  } else {
    modules.filter(_ => !_[1]!.exclude).forEach(_ => runOne(_[1]!, _[0]!))
  }
}

const httpWithCacheResolver = {
  order: 1,
  canRead: /^https?:/i,
  async read({url}: FileInfo) {
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
