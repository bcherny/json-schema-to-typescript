import {describe, expect, test} from 'bun:test'
import {execSync} from 'child_process'
import {readFileSync, unlinkSync, readdirSync, existsSync, lstatSync} from 'fs'
import {resolve, posix} from 'path'
import * as rimraf from 'rimraf'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('CLI', () => {
  test('pipe in, pipe out', () => {
    expect(
      execSync('node dist/src/cli.js', {
        encoding: 'utf-8',
        input: readFileSync('./test/resources/ReferencedType.json'),
      }).toString(),
    ).toMatchSnapshot()
  })

  test('pipe in (schema without ID), pipe out', () => {
    expect(
      execSync('node dist/src/cli.js', {
        encoding: 'utf-8',
        input: readFileSync('./test/resources/ReferencedTypeWithoutID.json'),
      }).toString(),
    ).toMatchSnapshot()
  })

  test('file in (no flags), pipe out', () => {
    expect(execSync('node dist/src/cli.js ./test/resources/ReferencedType.json').toString()).toMatchSnapshot()
  })

  test('file in (--input), pipe out', () => {
    expect(execSync('node dist/src/cli.js --input ./test/resources/ReferencedType.json').toString()).toMatchSnapshot()
  })

  test('file in (-i), pipe out', () => {
    expect(execSync('node dist/src/cli.js -i ./test/resources/ReferencedType.json').toString()).toMatchSnapshot()
  })

  test('file in (-i), unreachable definitions flag, pipe out', () => {
    expect(
      execSync('node dist/src/cli.js -i ./test/resources/DefinitionsOnly.json --unreachableDefinitions').toString(),
    ).toMatchSnapshot()
  })

  test('file in (-i), style flags, pipe out', () => {
    expect(
      execSync('node dist/src/cli.js -i ./test/resources/Enum.json --style.singleQuote --no-style.semi').toString(),
    ).toMatchSnapshot()
  })

  test('file in (-i), pipe out (absolute path)', () => {
    expect(execSync(`node dist/src/cli.js -i ${__dirname}/resources/ReferencedType.json`).toString()).toMatchSnapshot()
  })

  test('file in (yaml), pipe out', () => {
    expect(execSync('node dist/src/cli.js ./test/resources/Schema.yaml').toString()).toMatchSnapshot()
  })

  test('pipe in, file out (--output)', () => {
    execSync('node dist/src/cli.js --output ./ReferencedType.d.ts', {
      input: readFileSync('./test/resources/ReferencedType.json'),
    })
    expect(readFileSync('./ReferencedType.d.ts', 'utf-8')).toMatchSnapshot()
    unlinkSync('./ReferencedType.d.ts')
  })

  test('pipe in, file out (-o)', () => {
    execSync('node dist/src/cli.js -o ./ReferencedType.d.ts', {
      input: readFileSync('./test/resources/ReferencedType.json'),
    })
    expect(readFileSync('./ReferencedType.d.ts', 'utf-8')).toMatchSnapshot()
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (no flags), file out (no flags)', () => {
    execSync('node dist/src/cli.js ./test/resources/ReferencedType.json ./ReferencedType.d.ts')
    expect(readFileSync('./ReferencedType.d.ts', 'utf-8')).toMatchSnapshot()
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (-i), file out (-o)', () => {
    execSync('node dist/src/cli.js -i ./test/resources/ReferencedType.json -o ./ReferencedType.d.ts')
    expect(readFileSync('./ReferencedType.d.ts', 'utf-8')).toMatchSnapshot()
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (--input), file out (--output)', () => {
    execSync('node dist/src/cli.js --input ./test/resources/ReferencedType.json --output ./ReferencedType.d.ts')
    expect(readFileSync('./ReferencedType.d.ts', 'utf-8')).toMatchSnapshot()
    unlinkSync('./ReferencedType.d.ts')
  })

  test('--unknownAny', () => {
    expect(
      execSync('node dist/src/cli.js --unknownAny=false --input ./test/resources/ReferencedType.json').toString(),
    ).toMatchSnapshot()
  })

  test('--additionalProperties', () => {
    expect(
      execSync(
        'node dist/src/cli.js --additionalProperties=false --input ./test/resources/ReferencedType.json',
      ).toString(),
    ).toMatchSnapshot()
  })

  test('files in (-i), files out (-o)', () => {
    execSync(
      `node dist/src/cli.js -i "./test/resources/MultiSchema/**/*.{json,yaml,yml}" -o ./test/resources/MultiSchema/out`,
    )

    // sort to ensure a stable order across environments
    readdirSync('./test/resources/MultiSchema/out')
      .sort()
      .forEach(f => {
        const path = `./test/resources/MultiSchema/out/${f}`
        expect(path).toMatchSnapshot()
        expect(readFileSync(path, 'utf-8')).toMatchSnapshot()
        unlinkSync(path)
      })
    rimraf.sync('./test/resources/MultiSchema/out')
  })

  test('files in (-i), pipe out', () => {
    expect(
      execSync(`node dist/src/cli.js -i "./test/resources/MultiSchema/**/*.{json,yaml,yml}"`).toString(),
    ).toMatchSnapshot()
  })

  test('files in (-i), files out (-o) nested dir does not exist', () => {
    execSync(
      `node dist/src/cli.js -i "./test/resources/MultiSchema/**/*.{json,yaml,yml}" -o ./test/resources/MultiSchema/foo/bar/out`,
    )
    // sort to ensure a stable order across environments
    readdirSync('./test/resources/MultiSchema/foo/bar/out')
      .sort()
      .forEach(f => {
        const path = `./test/resources/MultiSchema/foo/bar/out/${f}`
        expect(path).toMatchSnapshot()
        expect(readFileSync(path, 'utf-8')).toMatchSnapshot()
        unlinkSync(path)
      })
    rimraf.sync('./test/resources/MultiSchema/foo')
  })

  test('extra positional arguments (e.g. from an unquoted glob) error out instead of overwriting a file', () => {
    const outFile = './test/resources/MultiSchema/out.d.ts'
    expect(() =>
      execSync(
        `node dist/src/cli.js -i ./test/resources/MultiSchema/a.json ./test/resources/MultiSchema/b.yaml -o ${outFile}`,
        {stdio: 'pipe'},
      ),
    ).toThrow()
    expect(existsSync(outFile)).toBe(false)
  })

  test('files in (-i), files out (-o) matching nested dir', () => {
    execSync(
      `node dist/src/cli.js -i "./test/resources/../../test/resources/MultiSchema2/" -o ./test/resources/MultiSchema2/out`,
    )
    getPaths('./test/resources/MultiSchema2/out').forEach(file => {
      expect(file).toMatchSnapshot()
      expect(readFileSync(file, 'utf-8')).toMatchSnapshot()
      unlinkSync(file)
    })
    rimraf.sync('./test/resources/MultiSchema2/out')
  })
})

function getPaths(path: string, paths: string[] = []) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(resolve(path)).forEach(item => getPaths(posix.join(posix.normalize(path), item), paths))
  } else {
    paths.push(path)
  }

  // sort paths to ensure a stable order across environments
  return paths.sort((a, b) => a.localeCompare(b))
}
