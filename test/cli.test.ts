import {afterAll, beforeAll, describe, expect, test} from 'bun:test'
import {exec} from 'child_process'
import {readFileSync, unlinkSync, readdirSync, existsSync, lstatSync} from 'fs'
import {availableParallelism} from 'os'
import {resolve, posix} from 'path'
import * as rimraf from 'rimraf'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

type Result = {error: Error | null; stdout: string; stderr: string}

// Most of a CLI test is node starting up, so every invocation is spawned before the
// first CLI test runs (at most one per core at a time) and each test then awaits
// its own result. Tests that write to a file each use their own path, so they can
// overlap too.
const spawners: (() => void)[] = []
const results = new Map<string, Promise<Result>>()
let running = 0
const waiting: (() => void)[] = []
async function run(command: string, input?: string, cwd?: string): Promise<Result> {
  if (running >= availableParallelism()) {
    await new Promise<void>(_ => waiting.push(_))
  }
  running++
  try {
    return await new Promise<Result>(done => {
      const child = exec(command, {encoding: 'utf-8', cwd}, (error, stdout, stderr) => {
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

// Piped input resolves its Prettier config from the working directory, so the
// stdin tests run from test/resources, whose .prettierrc pins the default style.
const STDIN_CWD = resolve('test/resources')
const CLI = resolve('dist/src/cli.js')

function cliTest(
  name: string,
  command: string,
  check: (output: Omit<Result, 'error'>) => void,
  input?: string,
  cwd?: string,
) {
  spawners.push(() => results.set(name, run(command, input, cwd)))
  test(name, async () => {
    const {error, ...output} = await results.get(name)!
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

// Everything the file-writing tests below create, for afterAll to clear when a
// filtered run spawned them all but only ran some.
const OUTPUTS = [
  ...[1, 2, 3, 4, 5].map(n => `./test/resources/ReferencedType.${n}.d.ts`),
  './test/resources/prettier-output/Enum.d.ts',
  './test/resources/MultiSchema/out',
  './test/resources/MultiSchema/foo',
  './test/resources/MultiSchemaRefs/response/out',
  './test/resources/MultiSchema2/out',
]

suite('CLI', () => {
  // bun skips these hooks when no CLI test is selected (`-t`, `only`), so such a
  // run spawns nothing; and afterAll waits for every child, so none outlives the
  // run to write into the working tree after bun has exited.
  beforeAll(() => spawners.forEach(spawn => spawn()))
  afterAll(async () => {
    await Promise.all(results.values())
    OUTPUTS.forEach(path => rimraf.sync(path))
  })

  cliTest(
    'pipe in, pipe out',
    `node ${CLI}`,
    ({stdout, stderr}) => {
      // stderr must stay clean too: no warnings (e.g. Node deprecation notices) for a plain stdin run
      expect(stderr).toBe('')
      expect(stdout).toMatchSnapshot()
    },
    readFileSync('./test/resources/ReferencedType.json', 'utf-8'),
    STDIN_CWD,
  )

  cliTest(
    'pipe in (schema without ID), pipe out',
    `node ${CLI}`,
    ({stdout}) => expect(stdout).toMatchSnapshot(),
    readFileSync('./test/resources/ReferencedTypeWithoutID.json', 'utf-8'),
    STDIN_CWD,
  )

  cliTest(
    'pipe in (schema without title or ID), pipe out',
    `node ${CLI}`,
    ({stdout}) => expect(stdout).toMatchSnapshot(),
    readFileSync('./test/resources/NoTitleOrID.json', 'utf-8'),
    STDIN_CWD,
  )

  cliTest('file in (no flags), pipe out', 'node dist/src/cli.js ./test/resources/ReferencedType.json', ({stdout}) =>
    expect(stdout).toMatchSnapshot(),
  )

  // The file name is the fallback type name, and `2024` has no identifier characters left
  // once the leading digits are stripped: the root used to get an empty name and the CLI
  // printed nothing but the banner comment.
  cliTest(
    'file in (untitled schema, digits-only file name), pipe out',
    'node dist/src/cli.js ./test/resources/DigitsOnlyName/2024.json',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
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

  // https://github.com/bcherny/json-schema-to-typescript/issues/183: one dotted flag per format
  cliTest(
    'file in (-i), formatTypes flags, pipe out',
    'node dist/src/cli.js -i ./test/resources/FormatTypes.json --formatTypes.date-time=Date --formatTypes.uri URL',
    ({stdout}) => {
      expect(stdout).toContain('createdAt: Date;')
      expect(stdout).toContain('links?: URL[];')
      expect(stdout).toContain('email?: string;')
    },
  )

  // https://github.com/bcherny/json-schema-to-typescript/issues/631: `$refOptions` are dotted
  // flags like `style`; quoted, because of the `$`. These fixtures spell their `$ref`s relative
  // to the repository root, which only resolves with `externalReferenceResolution: 'root'`.
  const quote = process.platform === 'win32' ? '"' : "'"
  cliTest(
    'file in (-i), $refOptions flag, pipe out',
    `node dist/src/cli.js -i ./test/resources/refOptions/specific/specific.yml ${quote}--$refOptions.dereference.externalReferenceResolution=root${quote}`,
    ({stdout}) => {
      expect(stdout).toContain('export type TestResourcesRefOptionsSpecificSpecificYml =')
      expect(stdout).toContain('export interface TestResourcesRefOptionsCommonYml {')
    },
  )

  // https://github.com/bcherny/json-schema-to-typescript/issues/199: an explicit `false` for a
  // style flag has to reach Prettier as a boolean, however it is spelled
  for (const flag of ['--no-style.singleQuote', '--style.singleQuote false', '--style.singleQuote=false']) {
    cliTest(
      `file in (-i), style boolean with explicit false value (${flag}), pipe out`,
      `node dist/src/cli.js -i ./test/resources/Enum.json ${flag}`,
      ({stdout}) => expect(stdout).toContain('fstype?: "ext3" | "ext4" | "btrfs"'),
    )
  }

  cliTest(
    'file in (-i), Prettier config, pipe out',
    'node dist/src/cli.js -i ./test/resources/prettier/Enum.json',
    ({stdout}) => {
      expect(stdout).toContain('    fstype?: "ext3" | "ext4" | "btrfs"')
      expect(stdout).not.toContain(';')
    },
  )

  cliTest(
    'file in (-i), style flags override Prettier config, pipe out',
    'node dist/src/cli.js -i ./test/resources/prettier/Enum.json --style.singleQuote --style.semi',
    ({stdout}) => expect(stdout).toContain("    fstype?: 'ext3' | 'ext4' | 'btrfs';"),
  )

  cliTest(
    'file in (-i), output Prettier config takes precedence',
    'node dist/src/cli.js -i ./test/resources/prettier/Enum.json -o ./test/resources/prettier-output/Enum.d.ts',
    () => {
      const path = './test/resources/prettier-output/Enum.d.ts'
      expect(readFileSync(path, 'utf-8')).toContain("  fstype?: 'ext3' | 'ext4' | 'btrfs';")
      unlinkSync(path)
    },
  )

  cliTest(
    'file in (-i), Prettier overrides for the generated .d.ts apply, *.json ones and `parser` do not, pipe out',
    'node dist/src/cli.js -i ./test/resources/prettier-overrides/Enum.json',
    ({stdout}) => expect(stdout).toContain("  fstype?: 'ext3' | 'ext4' | 'btrfs'\n"),
  )

  cliTest(
    'pipe in, Prettier config from the working directory, pipe out',
    `node ${CLI}`,
    ({stdout}) => {
      expect(stdout).toContain('    fstype?: "ext3" | "ext4" | "btrfs"')
      expect(stdout).not.toContain(';')
    },
    readFileSync('./test/resources/prettier/Enum.json', 'utf-8'),
    resolve('test/resources/prettier'),
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
    `node ${CLI} --output ${resolve('test/resources/ReferencedType.1.d.ts')}`,
    expectFile('./test/resources/ReferencedType.1.d.ts'),
    readFileSync('./test/resources/ReferencedType.json', 'utf-8'),
    STDIN_CWD,
  )

  cliTest(
    'pipe in, file out (-o)',
    `node ${CLI} -o ${resolve('test/resources/ReferencedType.2.d.ts')}`,
    expectFile('./test/resources/ReferencedType.2.d.ts'),
    readFileSync('./test/resources/ReferencedType.json', 'utf-8'),
    STDIN_CWD,
  )

  cliTest(
    'file in (no flags), file out (no flags)',
    'node dist/src/cli.js ./test/resources/ReferencedType.json ./test/resources/ReferencedType.3.d.ts',
    expectFile('./test/resources/ReferencedType.3.d.ts'),
  )

  cliTest(
    'file in (-i), file out (-o)',
    'node dist/src/cli.js -i ./test/resources/ReferencedType.json -o ./test/resources/ReferencedType.4.d.ts',
    expectFile('./test/resources/ReferencedType.4.d.ts'),
  )

  cliTest(
    'file in (--input), file out (--output)',
    'node dist/src/cli.js --input ./test/resources/ReferencedType.json --output ./test/resources/ReferencedType.5.d.ts',
    expectFile('./test/resources/ReferencedType.5.d.ts'),
  )

  cliTest(
    '--unknownAny',
    'node dist/src/cli.js --unknownAny=false --input ./test/resources/ReferencedType.json',
    ({stdout}) => expect(stdout).toMatchSnapshot(),
  )

  cliTest(
    '--declarationStyle',
    'node dist/src/cli.js --declarationStyle type --input ./test/resources/ReferencedType.json',
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
