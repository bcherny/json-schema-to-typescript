import test from 'ava'
import { execSync } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'

export function run() {

  test('pipe in, pipe out', t => {
    t.snapshot(
      execSync('shx cat ./test/resources/ReferencedType.json | node dist/src/cli.js', { encoding: 'utf-8' }).toString()
    )
  })

  test('pipe in (schema without ID), pipe out', t => {
    t.snapshot(
      execSync('shx cat ./test/resources/ReferencedTypeWithoutID.json | node dist/src/cli.js', { encoding: 'utf-8' }).toString()
    )
  })

  test('file in (no flags), pipe out', t => {
    t.snapshot(
      execSync('node dist/src/cli.js ./test/resources/ReferencedType.json').toString()
    )
  })

  test('file in (--input), pipe out', t => {
    t.snapshot(
      execSync('node dist/src/cli.js --input ./test/resources/ReferencedType.json').toString()
    )
  })

  test('file in (-i), pipe out', t => {
    t.snapshot(
      execSync('node dist/src/cli.js -i ./test/resources/ReferencedType.json').toString()
    )
  })

  test('file in (-i), unreachable definitions flag, pipe out', t => {
    t.snapshot(
      execSync('node dist/src/cli.js -i ./test/resources/DefinitionsOnly.json --unreachableDefinitions').toString()
    )
  })

  test('file in (-i), style flags, pipe out', t => {
    t.snapshot(
      execSync('node dist/src/cli.js -i ./test/resources/Enum.json --style.singleQuote --no-style.semi').toString()
    )
  })

  test('file in (-i), pipe out (absolute path)', t => {
    t.snapshot(
      execSync(`node dist/src/cli.js -i ${__dirname}/../../test/resources/ReferencedType.json`).toString()
    )
  })

  test('pipe in, file out (--output)', t => {
    execSync('shx cat ./test/resources/ReferencedType.json | node dist/src/cli.js --output ./ReferencedType.d.ts').toString()
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('pipe in, file out (-o)', t => {
    execSync('shx cat ./test/resources/ReferencedType.json | node dist/src/cli.js -o ./ReferencedType.d.ts').toString()
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (no flags), file out (no flags)', t => {
    execSync('node dist/src/cli.js ./test/resources/ReferencedType.json ./ReferencedType.d.ts').toString()
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (-i), file out (-o)', t => {
    execSync('node dist/src/cli.js -i ./test/resources/ReferencedType.json -o ./ReferencedType.d.ts').toString()
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (--input), file out (--output)', t => {
    execSync('node dist/src/cli.js --input ./test/resources/ReferencedType.json --output ./ReferencedType.d.ts').toString()
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

}
