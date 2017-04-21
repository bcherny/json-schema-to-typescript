import { test } from 'ava'
import { readdirSync } from 'fs'
import { template } from 'lodash'
import { join } from 'path'
import { JSONSchema } from '../src'
import { normalize } from '../src/normalizer'
import { compare } from './reporter'

interface JSONTestCase {
  name: string
  in: JSONSchema
  out: JSONSchema
}

const normalizerDir = __dirname + '/../../test/normalizer'

export function run() {
  readdirSync(normalizerDir)
    .filter(_ => /^.*\.json$/.test(_))
    .map(_ => join(normalizerDir, _))
    .map(_ => [_, require(_) as JSONTestCase])
    .forEach(([filename, json]: [string, JSONTestCase]) => {
      const params = { filename }
      test(json.name, t =>
        compare(
          t,
          json.name,
          template(toString(normalize(json.in, filename)))(params),
          template(toString(json.out))(params)
        )
      )
    })
}

function toString(json: Object): string {
  return JSON.stringify(json, null, 2)
}
