import {describe, expect, test} from 'bun:test'
import {exec} from 'child_process'
import {readFileSync, unlinkSync, readdirSync, existsSync, lstatSync} from 'fs'
import {availableParallelism} from 'os'
import {resolve, posix} from 'path'
import * as rimraf from 'rimraf'
import {hasOnly} from './e2eCases'

const skip = hasOnly()
const suite = skip ? describe.skip : describe

type Result = {error: Error | null; stdout: string; stderr: string}

// Most of a CLI test is node starting up, so every invocation is spawned up front
// (at most one per core at a time) and each test then awaits its own result.
// Tests that write to a file each use their own path, so they can overlap too.
let running = 0
const waiting: (() => void)[] = []
async function run(command: string, input?: string): Promise<Result> {
  if (running >= availableParallelism()) {
    await new Promise<void>(_ => waiting.push(_))
  }
  running++
  try {
    return await new Promise<Result>(done => {
      const child = exec(command, {encoding: 'utf-8'}, (error, stdout, stderr) => {
        process.stderr.write(stderr) // keep it visible, as it is for a CLI run by hand
        done({error, stdout, stderr})
      })
      child.stdin!.end(input)
    })
  } finally {
    running--
    waiting.shift()?.()
  }
}

function cliTest(name: string, command: string, check: (output: Omit<Result, 'error'>) => void, input?: string) {
  const result = skip ? undefined : run(command, input)
  test(name, async () => {
    const {error, ...output} = await result!
    if (error) {
      throw error
    }
    check(output)
  })
}

const expectFile = (path: string) => () => {
  expect(readFileSync(path, 'utf-8')).toMatchSnapshot()
  unlinkSync(path)
}

suite('CLI', () => {
  cliTest(
    'pipe in, pipe out',
    'node dist/src/cli.js',
    ({stdout, stderr}) => {
      // stderr must stay clean too: no warnings (e.g. Node deprecation notices) for a plain stdin run
      expect(stderr).toBe('')
      expect(stdout).toMatchSnapshot()
    },
    readFileSync('./test/resources/ReferencedType.json', 'utf-8'),
  )

  cliTest(
    'pipe in (schema without ID), pipe out',
    'node dist/src/cli.js',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
    readFileSync('./test/resources/ReferencedTypeWithoutID.json', 'utf-8'),
  )

  cliTest('file in (no flags), pipe out', 'node dist/src/cli.js ./test/resources/ReferencedType.json', ({stdout}) =>
    expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'file in (--input), pipe out',
    'node dist/src/cli.js --input ./test/resources/ReferencedType.json',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest('file in (-i), pipe out', 'node dist/src/cli.js -i ./test/resources/ReferencedType.json', ({stdout}) =>
    expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'file in (-i), unreachable definitions flag, pipe out',
    'node dist/src/cli.js -i ./test/resources/DefinitionsOnly.json --unreachableDefinitions',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'file in (-i), style flags, pipe out',
    'node dist/src/cli.js -i ./test/resources/Enum.json --style.singleQuote --no-style.semi',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'file in (-i), pipe out (absolute path)',
    `node dist/src/cli.js -i ${__dirname}/resources/ReferencedType.json`,
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest('file in (yaml), pipe out', 'node dist/src/cli.js ./test/resources/Schema.yaml', ({stdout}) =>
    expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'pipe in, file out (--output)',
    'node dist/src/cli.js --output ./ReferencedType.1.d.ts',
    expectFile('./ReferencedType.1.d.ts'),
    readFileSync('./test/resources/ReferencedType.json', 'utf-8'),
  )

  cliTest(
    'pipe in, file out (-o)',
    'node dist/src/cli.js -o ./ReferencedType.2.d.ts',
    expectFile('./ReferencedType.2.d.ts'),
    readFileSync('./test/resources/ReferencedType.json', 'utf-8'),
  )

  cliTest(
    'file in (no flags), file out (no flags)',
    'node dist/src/cli.js ./test/resources/ReferencedType.json ./ReferencedType.3.d.ts',
    expectFile('./ReferencedType.3.d.ts'),
  )

  cliTest(
    'file in (-i), file out (-o)',
    'node dist/src/cli.js -i ./test/resources/ReferencedType.json -o ./ReferencedType.4.d.ts',
    expectFile('./ReferencedType.4.d.ts'),
  )

  cliTest(
    'file in (--input), file out (--output)',
    'node dist/src/cli.js --input ./test/resources/ReferencedType.json --output ./ReferencedType.5.d.ts',
    expectFile('./ReferencedType.5.d.ts'),
  )

  cliTest(
    '--unknownAny',
    'node dist/src/cli.js --unknownAny=false --input ./test/resources/ReferencedType.json',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    '--additionalProperties',
    'node dist/src/cli.js --additionalProperties=false --input ./test/resources/ReferencedType.json',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'files in (-i), files out (-o)',
    `node dist/src/cli.js -i "./test/resources/MultiSchema/**/*.{json,yaml,yml}" -o ./test/resources/MultiSchema/out`,
    () => {
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
    },
  )

  cliTest(
    'files in (-i), pipe out',
    `node dist/src/cli.js -i "./test/resources/MultiSchema/**/*.{json,yaml,yml}"`,
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    'files in (-i), files out (-o) nested dir does not exist',
    `node dist/src/cli.js -i "./test/resources/MultiSchema/**/*.{json,yaml,yml}" -o ./test/resources/MultiSchema/foo/bar/out`,
    () => {
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
    },
  )

  cliTest(
    'files in (-i), $ref resolves relative to referring file, not process.cwd() (#324)',
    `node dist/src/cli.js -i "./test/resources/MultiSchemaRefs/response/**/*.json" -o ./test/resources/MultiSchemaRefs/response/out`,
    () => {
      const path = './test/resources/MultiSchemaRefs/response/out/Referencing.d.ts'
      expect(readFileSync(path, 'utf-8')).toMatchSnapshot()
      rimraf.sync('./test/resources/MultiSchemaRefs/response/out')
    },
  )

  cliTest(
    'files in (-i), files out (-o) matching nested dir',
    `node dist/src/cli.js -i "./test/resources/../../test/resources/MultiSchema2/" -o ./test/resources/MultiSchema2/out`,
    () => {
      getPaths('./test/resources/MultiSchema2/out').forEach(file => {
        expect(file).toMatchSnapshot()
        expect(readFileSync(file, 'utf-8')).toMatchSnapshot()
        unlinkSync(file)
      })
      rimraf.sync('./test/resources/MultiSchema2/out')
    },
  )
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
