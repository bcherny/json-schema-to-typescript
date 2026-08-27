import type {FileInfo} from '@apidevtools/json-schema-ref-parser'
import {readdirSync} from 'fs'
import {find, merge} from 'lodash'
import {join} from 'path'
import {JSONSchema, Options} from '../src'
import {getWithCache} from './http'

const dir = join(__dirname, 'e2e')

export type TestCase = {
  input: JSONSchema
  error?: true
  exclude?: boolean
  only?: boolean
  options?: Options
}

const httpWithCacheResolver = {
  order: 1,
  canRead: /^https?:/i,
  async read({url}: FileInfo) {
    return await getWithCache(url)
  },
}

// [filename, contents][]
function getModules(): [string, TestCase][] {
  return readdirSync(dir)
    .filter(_ => !_.includes('.ignore.'))
    .filter(_ => /^.*\.ts$/.test(_))
    .map(_ => [_, require(join(dir, _))]) as [string, TestCase][]
}

/**
 * Exporting `const only=true` from a test case runs that case, and nothing else
 * in the suite. The other test files check this so that the narrowing applies
 * across files, not just within test/e2e.test.ts.
 */
export function hasOnly(): boolean {
  return getModules().some(_ => Boolean(_[1].only))
}

// exporting `const only=true` will only run that test
// exporting `const exclude=true` will not run that test
export function getTestCases(): [string, TestCase][] {
  const modules = getModules()
  const only = find(modules, _ => Boolean(_[1].only))
  return only ? [only] : modules.filter(_ => !_[1].exclude)
}

export function getOptions(testCase: TestCase): Options {
  return merge({enableDefaultComments: false}, testCase.options, {
    $refOptions: {resolve: {http: httpWithCacheResolver}},
  })
}
