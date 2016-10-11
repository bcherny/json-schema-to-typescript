import * as fs from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'

async function generate() {
  fs.writeFileSync('dist/model.d.ts', await compileFromFile('src/foo.json'))
  fs.writeFileSync('dist/model.d.ts', await compileFromFile('src/baz.json'))
}

generate()
