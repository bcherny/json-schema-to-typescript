import {describe, expect, test} from 'bun:test'
import {execSync, spawnSync} from 'child_process'
import {readFileSync, unlinkSync, readdirSync, existsSync, lstatSync, mkdirSync, copyFileSync} from 'fs'
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

  // @see https://github.com/bcherny/json-schema-to-typescript/issues/505 (as filed: `json2ts -i *.json` gives "no output")
  // An unquoted glob is expanded by the shell, so the CLI receives `-i A.json B.json C.json`.
  // On master the positionals win: B.json is taken as the input and C.json as the *output*,
  // so A is ignored, nothing is printed, the exit code is 0, and C.json is overwritten with
  // B's generated TypeScript. Whether extra inputs should all be compiled or rejected with a
  // hint to quote the glob is a maintainer decision; this test only asserts the invariant
  // both options share: an input schema is never overwritten, and the run does not silently
  // succeed while dropping inputs.
  test('files in (-i with shell-expanded glob): never overwrites a matched schema', () => {
    const dir = './test/resources/PositionalInputs/tmp'
    mkdirSync(dir, {recursive: true})
    const files = ['A', 'B', 'C'].map(_ => {
      copyFileSync(`./test/resources/PositionalInputs/${_}.json`, `${dir}/${_}.json`)
      return `${dir}/${_}.json`
    })
    const original = readFileSync(files[2], 'utf-8')

    const {status, stdout} = spawnSync('node', ['dist/src/cli.js', '-i', ...files], {encoding: 'utf-8'})
    const cAfter = readFileSync(files[2], 'utf-8')
    rimraf.sync(dir)

    expect(cAfter).toBe(original)
    expect(status !== 0 || ['A', 'B', 'C'].every(_ => stdout.includes(`interface ${_} `))).toBe(true)
  })

  // @see https://github.com/bcherny/json-schema-to-typescript/issues/505 (as confirmed in the thread)
  // Relative $refs must resolve against each glob-matched file's own directory,
  // not against the directory json2ts was launched from. On master item.json's
  // `../../common-spec/json-schema/common.json` is resolved against the repo root, the
  // CLI exits 1 with `ResolverError: Error opening file "<parent of repo>/common-spec/json-schema/common.json"`,
  // so execSync throws and this test fails. Same fixture and test as PR #713 (whose
  // src change is the same as #742's).
  test('files in (-i), files out (-o), glob matches across sibling directories with relative $refs', () => {
    execSync(
      `node dist/src/cli.js -i "./test/resources/MultiSchemaGlob/*-spec/json-schema/*.json" -o ./test/resources/MultiSchemaGlob/out`,
    )

    // sort to ensure a stable order across environments
    readdirSync('./test/resources/MultiSchemaGlob/out')
      .sort()
      .forEach(f => {
        const path = `./test/resources/MultiSchemaGlob/out/${f}`
        expect(path).toMatchSnapshot()
        expect(readFileSync(path, 'utf-8')).toMatchSnapshot()
        unlinkSync(path)
      })
    rimraf.sync('./test/resources/MultiSchemaGlob/out')
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
