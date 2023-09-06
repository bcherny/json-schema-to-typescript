import {writeFileSync} from 'node:fs'
import {compileFromFile} from '@kickstartds/json-schema-to-typescript'

async function generate() {
  writeFileSync('person.d.ts', await compileFromFile('person.json'))
}

generate()
