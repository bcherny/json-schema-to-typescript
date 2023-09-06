import test from 'ava'
import {readdirSync} from 'fs'
import {join} from 'path'
import {JSONSchema, Options, DEFAULT_OPTIONS} from '../src/index.js'
import {link} from '../src/linker.js'
import {normalize} from '../src/normalizer.js'

interface JSONTestCase {
  name: string
  in: JSONSchema
  out: JSONSchema
  options?: Options
}

const normalizerDir = __dirname + '/../test/normalizer'

export function run() {
  readdirSync(normalizerDir)
    .filter(_ => /^.*\.json$/.test(_))
    .map(_ => join(normalizerDir, _))
    .map(_ => [_, require(_)] as [string, JSONTestCase])
    .forEach(([filename, json]: [string, JSONTestCase]) => {
      test(json.name, t => {
        const normalized = normalize(link(json.in), new WeakMap(), filename, json.options ?? DEFAULT_OPTIONS)
        t.deepEqual(json.out, normalized)
      })
    })
}
