/**
 * Runs a single fuzz case in isolation.
 *
 * Lives in its own process so the parent can survive (and classify) an OOM, a
 * stack overflow, or a hang that would otherwise take the whole run down.
 *
 * Usage: node runCase.js <path-to-case.json>
 * Emits one line: __FUZZ_RESULT__ <json>
 */

const {readFileSync} = require('fs')
const {resolve} = require('path')

const DIST = resolve(__dirname, '../../dist/src/index.js')

async function main() {
  const casePath = process.argv[2]
  const {schema, options} = JSON.parse(readFileSync(casePath, 'utf-8'))
  const {compile} = require(DIST)

  let ts
  try {
    ts = await compile(schema, 'FuzzRoot', options)
  } catch (e) {
    return {
      status: 'THREW',
      errorName: e && e.constructor ? e.constructor.name : typeof e,
      message: e && e.message ? String(e.message).slice(0, 400) : String(e).slice(0, 400),
      frame: topFrame(e),
    }
  }

  // The compiler succeeded, but did it emit valid TypeScript? Syntactically broken
  // output is a real bug even though nothing threw — and with `format: false`
  // there is no Prettier parse to catch it.
  const syntaxError = findSyntaxError(ts)
  if (syntaxError) {
    return {status: 'INVALID_TS', errorName: 'SyntaxError', message: syntaxError, frame: ''}
  }

  return {status: 'OK'}
}

function topFrame(e) {
  if (!e || !e.stack) return ''
  const lines = String(e.stack).split('\n')
  for (const line of lines) {
    const m = line.match(/\((.*?)\)\s*$/) || line.match(/at\s+(.*)$/)
    if (!m) continue
    // First frame inside the library itself is the useful one for deduping.
    if (m[1].includes('/dist/src/')) {
      return m[1].replace(/^.*\/dist\/src\//, 'src/')
    }
  }
  return ''
}

function findSyntaxError(ts) {
  let typescript
  try {
    typescript = require('typescript')
  } catch {
    return null // TypeScript unavailable; skip this check rather than fail the case.
  }
  const sourceFile = typescript.createSourceFile('fuzz.ts', ts, typescript.ScriptTarget.Latest, true)
  const diagnostics = sourceFile.parseDiagnostics || []
  if (!diagnostics.length) return null
  const d = diagnostics[0]
  const text = typescript.flattenDiagnosticMessageText(d.messageText, ' ')
  const {line} = sourceFile.getLineAndCharacterOfPosition(d.start || 0)
  const offending = ts.split('\n')[line] || ''
  return `${text} (line ${line + 1}: ${offending.trim().slice(0, 120)})`
}

main().then(
  result => {
    process.stdout.write('__FUZZ_RESULT__ ' + JSON.stringify(result) + '\n')
  },
  e => {
    // A rejection from our own harness, not from the library under test.
    process.stdout.write(
      '__FUZZ_RESULT__ ' +
        JSON.stringify({
          status: 'HARNESS_ERROR',
          errorName: 'HarnessError',
          message: String((e && e.message) || e).slice(0, 400),
          frame: '',
        }) +
        '\n',
    )
  },
)
