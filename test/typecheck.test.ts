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

const cases = getTestCases().filter(
  ([name, testCase]) =>
    !testCase.error && testCase.options?.declareExternallyReferenced !== false && !REFERENCES_EXTERNAL_TYPES.has(name),
)

function fileName(name: string): string {
  return `${stripExtension(name)}.generated.ts`
}

// Compile every fixture up front and typecheck them all in a single program:
// per-program setup would otherwise dominate (~90ms × 100+ cases). Each generated
// file contains exports, so it's a module and can't collide with the others.
const setup = (async () => {
  const sources = new Map<string, string>()
  const compileErrors = new Map<string, unknown>()
  for (const [name, testCase] of cases) {
    try {
      sources.set(fileName(name), await compile(testCase.input, stripExtension(name), getOptions(testCase)))
    } catch (e) {
      compileErrors.set(fileName(name), e)
    }
  }

  const host = ts.createCompilerHost(COMPILER_OPTIONS)
  const readFile = host.readFile.bind(host)
  const fileExists = host.fileExists.bind(host)
  host.readFile = f => sources.get(f) ?? readFile(f)
  host.fileExists = f => sources.has(f) || fileExists(f)
  const program = ts.createProgram([...sources.keys()], COMPILER_OPTIONS, host)
  return {program, compileErrors}
})()

for (const [name] of cases) {
  test(`typecheck ${name}`, async () => {
    const {program, compileErrors} = await setup
    const file = fileName(name)
    if (compileErrors.has(file)) {
      throw compileErrors.get(file)
    }
    const sourceFile = program.getSourceFile(file)
    expect(sourceFile).toBeDefined()
    const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile).map(d => {
      const message = ts.flattenDiagnosticMessageText(d.messageText, '\n')
      const location =
        d.file && d.start !== undefined ? `:${d.file.getLineAndCharacterOfPosition(d.start).line + 1}` : ''
      return `TS${d.code}${location}: ${message}`
    })
    expect(diagnostics).toEqual([])
  })
}
