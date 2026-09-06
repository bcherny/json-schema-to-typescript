import {describe, expect, test} from 'bun:test'
import {readdirSync} from 'fs'
import {join} from 'path'
import {JSONSchema, Options, DEFAULT_OPTIONS} from '../src'
import {normalize} from '../src/normalizer'
import {hasOnly} from './e2eCases'

interface JSONTestCase {
  name: string
  in: JSONSchema
  out: JSONSchema
  options?: Options
}

const normalizerDir = join(__dirname, 'normalizer')

const suite = hasOnly() ? describe.skip : describe

suite('normalizer', () => {
  readdirSync(normalizerDir)
    .filter(_ => /^.*\.json$/.test(_))
    .map(_ => join(normalizerDir, _))
    .map(_ => [_, require(_)] as [string, JSONTestCase])
    .forEach(([filename, json]: [string, JSONTestCase]) => {
      test(json.name, () => {
        const normalized = normalize(json.in, new WeakMap(), filename, json.options ?? DEFAULT_OPTIONS)
        expect(json.out).toEqual(normalized)
      })
    })
})
