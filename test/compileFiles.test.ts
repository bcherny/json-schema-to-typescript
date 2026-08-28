import {describe, expect, test} from 'bun:test'
import {resolve} from 'path'
import ts from 'typescript'
import {compileFiles} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

/**
 * `compileFiles` (the CLI's `--imports`): a set of schema files becomes a set of modules
 * that import shared types from each other instead of each declaring a copy. Every set
 * is snapshotted per file and then typechecked as a whole, imports included.
 */
const SETS: {[name: string]: {[inputFile: string]: string}} = {
  // a.json and b.json both use common.json#/definitions/thing; a and b refer to each other
  Imports: {
    'test/resources/Imports/a.json': 'out/a.d.ts',
    'test/resources/Imports/b.json': 'out/b.d.ts',
    'test/resources/Imports/common.json': 'out/common.d.ts',
  },
  // `extends` across files
  extends: {
    'test/resources/extends/Circle.json': 'out/Circle.d.ts',
    'test/resources/extends/Shape.json': 'out/shapes/Shape.d.ts',
    'test/resources/extends/Square.json': 'out/Square.d.ts',
  },
  // a two-file cycle
  cycle: {
    'test/resources/cycle.3.json': 'out/cycle.3.d.ts',
    'test/resources/cycle.4.json': 'out/cycle.4.d.ts',
  },
  // the referenced file is outside the set: declared inline, as without --imports
  outsideTheSet: {
    'test/resources/MultiSchemaRefs/response/Referencing.json': 'out/Referencing.d.ts',
  },
}

const COMPILER_OPTIONS: ts.CompilerOptions = {strict: true, noEmit: true, skipLibCheck: true}

suite('compileFiles', () => {
  for (const [name, files] of Object.entries(SETS)) {
    test(name, async () => {
      const inputs = Object.entries(files).map(([filename, outputPath]) => ({filename, outputPath}))
      const modules = await compileFiles(inputs, {bannerComment: ''})
      expect(modules.length).toBe(inputs.length)
      inputs.forEach(({filename}, i) => expect(modules[i]).toMatchSnapshot(filename))

      const sources = new Map(inputs.map(({outputPath}, i) => [resolve(outputPath), modules[i]]))
      const host = ts.createCompilerHost(COMPILER_OPTIONS)
      const {readFile, fileExists} = host
      host.readFile = f => sources.get(resolve(f)) ?? readFile.call(host, f)
      host.fileExists = f => sources.has(resolve(f)) || fileExists.call(host, f)
      const program = ts.createProgram([...sources.keys()], COMPILER_OPTIONS, host)
      const diagnostics = ts
        .getPreEmitDiagnostics(program)
        .map(d => `${d.file?.fileName}: TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`)
      expect(diagnostics).toEqual([])
    })
  }
})
