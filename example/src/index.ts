import * as fs from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'

async function generate() {
  fs.writeFileSync('dist/person.d.ts', await compileFromFile('src/person.json'))
}

generate()
