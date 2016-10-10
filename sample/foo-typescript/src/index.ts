import * as fs from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'

async function generate() {
  fs.writeFileSync('dist/foo.d.ts', await compileFromFile('src/foo.json'))
}

generate()
