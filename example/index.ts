import * as fs from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'

async function generate() {
  fs.writeFileSync('./person.d.ts', await compileFromFile('./person.json'))
}

generate().then(() => console.log('Done!'))
