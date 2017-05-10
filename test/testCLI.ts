import { test } from 'ava'
import { execSync } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'

const expected = `export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /**
   * Age in years
   */
  age?: number;
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
}
`

export function run() {

  test('pipe in, pipe out', t => {
    t.is(
      execSync('cat ./test/resources/ReferencedType.json | node dist/src/cli.js', { encoding: 'utf-8' }).toString(),
      expected
    )
  })

  test('pipe in (schema without ID), pipe out', t => {
    t.is(
      execSync('cat ./test/resources/ReferencedTypeWithoutID.json | node dist/src/cli.js', { encoding: 'utf-8' }).toString(),
      expected
    )
  })

  test('file in (no flags), pipe out', t => {
    t.is(
      execSync('node dist/src/cli.js ./test/resources/ReferencedType.json').toString(),
      expected
    )
  })

  test('file in (--input), pipe out', t => {
    t.is(
      execSync('node dist/src/cli.js --input ./test/resources/ReferencedType.json').toString(),
      expected
    )
  })

  test('file in (-i), pipe out', t => {
    t.is(
      execSync('node dist/src/cli.js -i ./test/resources/ReferencedType.json').toString(),
      expected
    )
  })

  test('pipe in, file out (--output)', t => {
    execSync('cat ./test/resources/ReferencedType.json | node dist/src/cli.js --output ./ReferencedType.d.ts').toString()
    t.is(readFileSync('./ReferencedType.d.ts', 'utf-8'), expected)
    unlinkSync('./ReferencedType.d.ts')
  })

  test('pipe in, file out (-o)', t => {
    execSync('cat ./test/resources/ReferencedType.json | node dist/src/cli.js -o ./ReferencedType.d.ts').toString()
    t.is(readFileSync('./ReferencedType.d.ts', 'utf-8'), expected)
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (no flags), file out (no flags)', t => {
    execSync('node dist/src/cli.js ./test/resources/ReferencedType.json ./ReferencedType.d.ts').toString()
    t.is(readFileSync('./ReferencedType.d.ts', 'utf-8'), expected)
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (-i), file out (-o)', t => {
    execSync('node dist/src/cli.js -i ./test/resources/ReferencedType.json -o ./ReferencedType.d.ts').toString()
    t.is(readFileSync('./ReferencedType.d.ts', 'utf-8'), expected)
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (--input), file out (--output)', t => {
    execSync('node dist/src/cli.js --input ./test/resources/ReferencedType.json --output ./ReferencedType.d.ts').toString()
    t.is(readFileSync('./ReferencedType.d.ts', 'utf-8'), expected)
    unlinkSync('./ReferencedType.d.ts')
  })

}
