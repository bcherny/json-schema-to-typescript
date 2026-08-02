import {expect, test} from 'bun:test'
import ts from 'typescript'
import {compile} from '../src'
import {stripExtension} from '../src/utils'
import {getOptions, getTestCases} from './e2eCases'

/**
 * The e2e suite only snapshots compile()'s output string. This suite additionally
 * runs the TypeScript compiler over that output, so that generated code is
 * guaranteed to actually typecheck (e.g. no TS2411 from index signatures that
 * named properties aren't assignable to — see issue #671).
 */

// Test cases whose output intentionally doesn't compile standalone: their schemas
// use `tsType` to reference types that are declared externally. (Cases with
// `declareExternallyReferenced: false` are skipped for the same reason, below.)
// Don't add generator bugs to this list — fix the generator instead.
const REFERENCES_EXTERNAL_TYPES = new Set<string>(['optimize.ts'])

const COMPILER_OPTIONS: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
}

// One host for all test cases: virtualFiles overlays the generated source, and
// reusing the previous program lets TypeScript share parsed lib files.
const virtualFiles = new Map<string, string>()
const host = ts.createCompilerHost(COMPILER_OPTIONS)
const readFile = host.readFile.bind(host)
const fileExists = host.fileExists.bind(host)
host.readFile = f => virtualFiles.get(f) ?? readFile(f)
host.fileExists = f => virtualFiles.has(f) || fileExists(f)
let oldProgram: ts.Program | undefined

function typecheck(fileName: string, source: string): string[] {
  virtualFiles.set(fileName, source)
  const program = ts.createProgram([fileName], COMPILER_OPTIONS, host, oldProgram)
  oldProgram = program
  return ts.getPreEmitDiagnostics(program).map(d => {
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n')
    const location = d.file && d.start !== undefined ? `:${d.file.getLineAndCharacterOfPosition(d.start).line + 1}` : ''
    return `TS${d.code}${location}: ${message}`
  })
}

for (const [name, testCase] of getTestCases()) {
  if (
    testCase.error ||
    testCase.options?.declareExternallyReferenced === false ||
    REFERENCES_EXTERNAL_TYPES.has(name)
  ) {
    continue
  }
  test(`typecheck ${name}`, async () => {
    const output = await compile(testCase.input, stripExtension(name), getOptions(testCase))
    expect(typecheck(`${stripExtension(name)}.generated.ts`, output)).toEqual([])
  })
}
