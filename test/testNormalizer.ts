import test from 'ava'
import {readdirSync} from 'fs'
import {template} from 'lodash'
import {join} from 'path'
import {JSONSchema, Options, DEFAULT_OPTIONS} from '../src'
import {link} from '../src/linker'
import {normalize} from '../src/normalizer'

interface JSONTestCase {
  name: string
  in: JSONSchema
  out: JSONSchema
  options?: Options
}

const normalizerDir = __dirname + '/../../test/normalizer'

export function run() {
  readdirSync(normalizerDir)
    .filter(_ => /^.*\.json$/.test(_))
    .map(_ => join(normalizerDir, _))
    .map(_ => [_, require(_)] as [string, JSONTestCase])
    .forEach(([filename, json]: [string, JSONTestCase]) => {
      const params = {filename}
      test(json.name, t => {
        const normalized = normalize(link(json.in), filename, json.options || DEFAULT_OPTIONS)
        t.snapshot(template(toString(normalized))(params))
        t.deepEqual(json.out, normalized)
      })
    })
}

function toString(json: Record<string, any>): string {
  return JSON.stringify(json, null, 2)
}
