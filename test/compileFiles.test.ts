import {describe, expect, test} from 'bun:test'
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {basename, dirname, join, resolve, sep, win32} from 'path'
import ts from 'typescript'
import {compileFiles} from '../src'
import {moduleSpecifier} from '../src/modules'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

/**
 * `compileFiles` (the CLI's `--imports`): a set of schema files becomes a set of modules that
 * import shared types from each other instead of each declaring a copy. Every set is snapshotted
 * per file and then typechecked as one program -- imports, module resolution and all.
 *
 * Input file (relative to test/resources) -> output path
 */
const SETS: {[name: string]: {[inputFile: string]: string}} = {
  // The README's example: a.json and b.json both use common.json#/definitions/thing; a and b
  // refer to each other; b's $ref has a description of its own (so b keeps a commented copy)
  memo: {
    'Imports/memo/a.json': 'out/a.d.ts',
    'Imports/memo/b.json': 'out/b.d.ts',
    'Imports/memo/common.json': 'out/common.d.ts',
  },
  // a two-file cycle
  cycle: {
    'cycle.3.json': 'out/cycle.3.d.ts',
    'cycle.4.json': 'out/cycle.4.d.ts',
  },
  // a -> b -> c -> a, and c has an anyOf over all three
  cycle3: {
    'Imports/cycle3/a.json': 'out/a.d.ts',
    'Imports/cycle3/b.json': 'out/b.d.ts',
    'Imports/cycle3/c.json': 'out/c.d.ts',
  },
  // top -> left, right -> base#/definitions/node: everything declared once
  diamond: {
    'Imports/diamond/base.json': 'out/base.d.ts',
    'Imports/diamond/left.json': 'out/left.d.ts',
    'Imports/diamond/right.json': 'out/right.d.ts',
    'Imports/diamond/top.json': 'out/top.d.ts',
  },
  // three files each call something `Thing`: each file keeps its own names, the imports alias
  sametitle: {
    'Imports/sametitle/defs.json': 'out/defs.d.ts',
    'Imports/sametitle/one.json': 'out/one.d.ts',
    'Imports/sametitle/two.json': 'out/two.d.ts',
    'Imports/sametitle/user.json': 'out/user.d.ts',
  },
  // a local `Thing` plus two foreign ones: `{Thing as Thing1}`, `{Thing as Thing2}`
  doublealias: {
    'Imports/doublealias/main.json': 'out/main.d.ts',
    'Imports/doublealias/p.json': 'out/p.d.ts',
    'Imports/doublealias/q.json': 'out/q.d.ts',
  },
  // sibling and nested directories, output tree mirrored: `../common/x.js`, `../../common/x.js`
  sibdirs: {
    'Imports/sibdirs/common/x.json': 'out/common/x.d.ts',
    'Imports/sibdirs/models/a.json': 'out/models/a.d.ts',
    'Imports/sibdirs/models/deep/b.json': 'out/models/deep/b.d.ts',
  },
  // $refs to other.json#/definitions/x/properties/y (titled: imported), .../u (untitled: a
  // local copy named from the pointer, as without --imports) and other.json#/properties/p
  nestedptr: {
    'Imports/nestedptr/main.json': 'out/main.d.ts',
    'Imports/nestedptr/other.json': 'out/other.d.ts',
  },
  // foreign types in every position: items, tuple, additionalProperties, patternProperties,
  // anyOf, allOf, a named enum, a type-array definition, a tsType, a string alias
  positions: {
    'Imports/positions/defs.json': 'out/defs.d.ts',
    'Imports/positions/use.json': 'out/use.d.ts',
  },
  // `extends` across files, with the supertype's module in a subdirectory
  extends: {
    'extends/Circle.json': 'out/Circle.d.ts',
    'extends/Shape.json': 'out/shapes/Shape.d.ts',
    'extends/Square.json': 'out/Square.d.ts',
  },
  // a YAML member
  yamlmix: {
    'Imports/yamlmix/paint.json': 'out/paint.d.ts',
    'Imports/yamlmix/types.yaml': 'out/types.d.ts',
  },
  // one file addressed as `my%20defs.json`, `../my defs.json` and `../sub/../my%20defs.json`
  spell: {
    'Imports/spell/my defs.json': 'out/my defs.d.ts',
    'Imports/spell/sub/x.json': 'out/sub/x.d.ts',
    'Imports/spell/y.json': 'out/y.d.ts',
  },
  // the referenced file is outside the set: declared inline, as without --imports
  outsideTheSet: {
    'MultiSchemaRefs/response/Referencing.json': 'out/Referencing.d.ts',
  },
}

/** A set's `compileFiles` argument, input files taken relative to `base` */
const inputsOf = (set: {[inputFile: string]: string}, base = join('test', 'resources')) =>
  Object.entries(set).map(([input, outputPath]) => ({filename: join(base, ...input.split('/')), outputPath}))

suite('compileFiles', () => {
  for (const [name, set] of Object.entries(SETS)) {
    test(name, () => expectModules(inputsOf(set)))
  }

  // Three of the Azure Resource Manager schemas behind test/e2e/realWorld.azure.ts, laid out on
  // disk the way they reference each other (a real-world set, and one read from an absolute
  // temp path, which looks different on every OS)
  test('azure', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'jstt-'))
    try {
      const files = ['common/definitions', '2017-03-30/Microsoft.Compute', '2017-03-30/Microsoft.Compute.Extensions']
      const inputs = files.map(file => {
        const fixture = join('test', '__fixtures__', `${AZURE.replace(/[:/]/g, '-')}${file.replace('/', '-')}.json`)
        const filename = join(dir, ...file.split('/')) + '.json'
        mkdirSync(dirname(filename), {recursive: true})
        // every file sits one directory down, so the absolute URLs they use for each other become ../
        writeFileSync(filename, readFileSync(fixture, 'utf8').split(AZURE).join('../'))
        return {filename, outputPath: join(dir, 'out', ...file.split('/')) + '.d.ts'}
      })
      await expectModules(inputs, files)
    } finally {
      rmSync(dir, {recursive: true, force: true})
    }
  })

  test('input order does not matter, and compiling twice gives the same modules', async () => {
    const inputs = inputsOf(SETS.sametitle)
    const [forward, backward, again] = await Promise.all([
      compileFiles(inputs, OPTIONS),
      compileFiles([...inputs].reverse(), OPTIONS),
      compileFiles(inputs, OPTIONS),
    ])
    expect(backward.reverse()).toEqual(forward)
    expect(again).toEqual(forward)
  })

  test('filenames and output paths are relative to `cwd`; no options needed', async () => {
    const fromCwd = await compileFiles(inputsOf(SETS.memo, ''), {cwd: resolve('test/resources')})
    const absolute = await compileFiles(
      inputsOf(SETS.memo, resolve('test/resources')).map(_ => ({..._, outputPath: resolve(_.outputPath)})),
    )
    expect(fromCwd).toEqual(absolute)
    expect(fromCwd[0]).toContain('import type {Thing} from "./common.js";')
  })

  test('the same schema file twice is an error', () => {
    expect(
      compileFiles([
        {filename: 'test/resources/Imports/memo/a.json', outputPath: 'out/a.d.ts'},
        {filename: 'test/resources/Imports/memo/../memo/a.json', outputPath: 'out/a2.d.ts'},
      ]),
    ).rejects.toThrow('are the same schema file')
  })

  test('two schemas with the same output path is an error', () => {
    expect(
      compileFiles([
        {filename: 'test/resources/Imports/memo/a.json', outputPath: 'out/x.d.ts'},
        {filename: 'test/resources/Imports/memo/b.json', outputPath: './out/x.d.ts'},
      ]),
    ).rejects.toThrow('would both be written to the same file')
  })

  test('the other files of the set are served from memory, not read again through $ref', async () => {
    // With the $ref parser's own file resolver switched off, a.json's $refs to b.json and
    // common.json can only resolve because compileFiles already holds their contents
    const inputs = inputsOf(SETS.memo)
    expect(await compileFiles(inputs, {...OPTIONS, $refOptions: {resolve: {file: false}}})).toEqual(
      await compileFiles(inputs, OPTIONS),
    )
  })
})

describe('the typecheck the compileFiles tests rely on', () => {
  test('sees a missing module, a missing name and an extensionless import', () => {
    expect(
      typecheck([
        [
          'out/a.d.ts',
          'import type {B} from "./b.js";\nimport type {Nope} from "./nope.js";\nexport interface A {b?: B; n?: Nope; u?: Undeclared}\n',
        ],
        ['out/b.d.ts', 'import type {A} from "./a";\nexport interface B {a?: A}\n'],
      ]),
    ).toEqual([
      "a.d.ts: TS2307: Cannot find module './nope.js' or its corresponding type declarations.",
      "a.d.ts: TS2304: Cannot find name 'Undeclared'.",
      "b.d.ts: TS2834: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Consider adding an extension to the import path.",
    ])
  })
})

describe('moduleSpecifier', () => {
  test('is relative, with a .js extension', () => {
    expect(moduleSpecifier(resolve('out/a.d.ts'), resolve('out/b.d.ts'))).toBe('./b.js')
    expect(moduleSpecifier(resolve('out/models/deep/b.d.ts'), resolve('out/common/x.d.ts'))).toBe('../../common/x.js')
    expect(moduleSpecifier(resolve('out/a.ts'), resolve('out/sub/my defs.d.ts'))).toBe('./sub/my defs.js')
  })

  test('uses forward slashes for Windows paths', () => {
    expect(moduleSpecifier('C:\\out\\models\\a.d.ts', 'C:\\out\\common\\x.d.ts', win32)).toBe('../common/x.js')
    expect(moduleSpecifier('C:\\out\\a.d.ts', 'C:\\out\\b.d.ts', win32)).toBe('./b.js')
  })
})

const OPTIONS = {bannerComment: ''}
const AZURE = 'https://schema.management.azure.com/schemas/'

/**
 * Compiles the set, snapshots each module (under `names`, or the input file names), then
 * typechecks the modules as one program, strictly: lib checking on (the outputs are all .d.ts,
 * which `skipLibCheck` would skip), no ambient types, NodeNext resolution (the strictest about
 * import specifiers). The compiler reads the modules from memory at their output paths.
 */
async function expectModules(inputs: {filename: string; outputPath: string}[], names = inputs.map(_ => _.filename)) {
  const modules = await compileFiles(inputs, OPTIONS)
  expect(modules.length).toBe(inputs.length)
  names.forEach((name, i) => expect(modules[i]).toMatchSnapshot(name.split(sep).join('/')))

  expect(typecheck(inputs.map(({outputPath}, i) => [outputPath, modules[i]]))).toEqual([])
}

/** Typechecks the given files as one program (see `expectModules`) and returns the diagnostics */
function typecheck(files: [path: string, source: string][]): string[] {
  const sources = new Map(files.map(([path, source]) => [slashes(resolve(path)), source]))
  // `"type": "module"` next to every output, so that NodeNext holds the imports to the ESM rules
  for (const file of [...sources.keys()]) {
    sources.set(file.slice(0, file.lastIndexOf('/')) + '/package.json', '{"type": "module"}')
  }
  const directories = new Set<string>()
  for (let dir of sources.keys()) {
    while ((dir = dir.slice(0, Math.max(dir.lastIndexOf('/'), 0))) && !directories.has(dir)) {
      directories.add(dir)
    }
  }
  const host = ts.createCompilerHost(COMPILER_OPTIONS)
  const {readFile, fileExists, directoryExists} = host
  host.readFile = f => sources.get(slashes(f)) ?? readFile.call(host, f)
  host.fileExists = f => sources.has(slashes(f)) || fileExists.call(host, f)
  host.realpath = _ => _ // the modules exist only in memory; nothing on disk to canonicalize against
  host.directoryExists = d => directories.has(slashes(d)) || (directoryExists ?? ts.sys.directoryExists).call(host, d)
  const roots = [...sources.keys()].filter(_ => !_.endsWith('/package.json'))
  const program = ts.createProgram(roots, COMPILER_OPTIONS, host)
  return ts
    .getPreEmitDiagnostics(program)
    .map(
      d =>
        `${d.file ? basename(d.file.fileName) : ''}: TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, '; ')}`,
    )
}

const COMPILER_OPTIONS: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  skipLibCheck: false, // the outputs are all .d.ts
  skipDefaultLibCheck: true,
  types: [],
  lib: ['lib.es5.d.ts'],
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
}

/** d:\out\a.d.ts and D:/out/a.d.ts alike -> d:/out/a.d.ts (TypeScript hands hosts forward-slashed paths) */
function slashes(path: string): string {
  return path.replace(/\\/g, '/').replace(/^[A-Z]:/, _ => _.toLowerCase())
}
