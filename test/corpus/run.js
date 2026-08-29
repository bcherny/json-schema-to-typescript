#!/usr/bin/env node
/**
 * Compile every schema in test/corpus/schemas/ under a few option sets and run the
 * TypeScript compiler over the results. Exits non-zero if any schema fails to
 * compile or any output draws a diagnostic. See README.md.
 *
 *   bun run build:server
 *   node test/corpus/run.js [--e2e] [--only <name>[,<name>...]] [--variant <v>[,<v>...]] [--out <dir>]
 *
 * --e2e adds the realWorld.* fixtures from test/e2e; the test suite already
 * type-checks those under their own options, this puts them through the other
 * option sets too.
 * --out writes each output to <dir>/<name>.<variant>.ts so a failure can be opened
 * in an editor; without it everything stays in memory.
 */
const {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} = require('fs')
const minimist = require('minimist')
const {join, resolve} = require('path')
const ts = require('typescript')
const vm = require('vm')
const {compile} = require('../../dist/src')
const sources = require('./sources.json')

const ROOT = join(__dirname, '..', '..')
const SCHEMAS = join(__dirname, 'schemas')
const E2E = join(ROOT, 'test', 'e2e')
const HTTP_FIXTURES = join(ROOT, 'test', '__fixtures__')

/**
 * Option sets layered over each entry's own options. `default` is what a user who
 * passes nothing gets (formatter included); the others switch on the options that
 * change emitted declarations the most, in two compatible groups, with the
 * formatter off since it cannot change whether the output type-checks.
 */
const VARIANTS = {
  default: {},
  strict: {
    format: false,
    strictIndexSignatures: true,
    undefinedOptionalProperties: true,
    unreachableDefinitions: true,
  },
  style: {
    format: false,
    additionalProperties: false,
    declarationStyle: 'type',
    enableConstEnums: false,
    readonly: true,
    unknownAny: false,
  },
}

const COMPILER_OPTIONS = {strict: true, noEmit: true, skipLibCheck: true, types: [], lib: ['lib.es2015.d.ts']}

// The corpus is self-contained on purpose: a schema that reaches for the network
// would make the job depend on someone else's uptime. The e2e fixtures that do have
// remote $refs are served from the test suite's checked-in cache (one file per URL,
// named as test/http.ts names them; bench/bench.mjs reads it the same way).
const offline = {
  resolve: {
    http: {
      read({url}) {
        const cached = join(HTTP_FIXTURES, url.replace(/[:/\\]/g, '-'))
        if (existsSync(cached)) return readFileSync(cached)
        throw new Error(`corpus schemas must not fetch remote $refs (wanted ${url})`)
      },
    },
  },
}

function parseArgs(argv) {
  const defaults = {e2e: false, only: '', variant: '', out: ''}
  const args = minimist(argv, {default: defaults, boolean: ['e2e'], string: ['only', 'variant', 'out']})
  const unknown = Object.keys(args)
    .filter(k => k !== '_' && !(k in defaults))
    .concat(args._)
  if (unknown.length) throw new Error(`unknown arguments: ${unknown.join(' ')}; usage: see the header of ${__filename}`)
  const list = s => (s ? s.split(',') : null)
  return {e2e: args.e2e, only: list(args.only), variant: list(args.variant), out: args.out ? resolve(args.out) : null}
}

/** [{name, options, schema()}]: the vendored schemas, plus the realWorld e2e fixtures if asked. */
function loadEntries(e2e) {
  const read = s => JSON.parse(readFileSync(s.file ? join(ROOT, s.file) : join(SCHEMAS, s.name + '.json'), 'utf8'))
  const entries = sources.map(s => ({...s, schema: () => read(s)}))
  if (!e2e) return entries
  for (const file of readdirSync(E2E)
    .filter(f => /^realWorld\..*\.ts$/.test(f) && !f.includes('.ignore.'))
    .sort()) {
    const {input, options = {}, error, exclude} = loadE2eModule(join(E2E, file))
    if (!error && !exclude)
      entries.push({name: file.replace(/\.ts$/, ''), options, schema: () => structuredClone(input)})
  }
  return entries
}

// test/e2e cases are TypeScript modules exporting `input` and maybe `options` (cf. loadTestCase in
// test/e2eCases.ts); transpile so that plain node can load them, as bench/bench.mjs does.
function loadE2eModule(path) {
  const {outputText} = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
  })
  const mod = {exports: {}}
  vm.runInThisContext(`(function (exports, require, module) {${outputText}\n})`, {filename: path})(
    mod.exports,
    require,
    mod,
  )
  return mod.exports
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const entries = loadEntries(args.e2e).filter(s => !args.only || args.only.includes(s.name))
  const variants = Object.keys(VARIANTS).filter(v => !args.variant || args.variant.includes(v))
  if (args.out) mkdirSync(args.out, {recursive: true})

  const outputs = new Map() // file name -> generated TypeScript
  const failures = []
  const started = Date.now()
  for (const entry of entries) {
    for (const variant of variants) {
      const file = `${entry.name}.${variant}.ts`
      const options = {
        bannerComment: '',
        ...entry.options,
        ...VARIANTS[variant],
        cwd: SCHEMAS + '/',
        $refOptions: offline,
      }
      const t = Date.now()
      try {
        const output = await compile(entry.schema(), entry.name, options)
        outputs.set(file, output)
        if (args.out) writeFileSync(join(args.out, file), output)
        console.log(`${file}\t${Date.now() - t} ms\t${output.length} B`)
      } catch (e) {
        failures.push(`${file}: compile() threw: ${(e && e.stack) || e}`)
        console.log(`${file}\t${Date.now() - t} ms\tTHREW`)
      }
    }
  }
  console.log(`compiled ${outputs.size} of ${entries.length * variants.length} in ${seconds(started)} s`)

  // One program for everything: per-program setup would otherwise dominate. Every
  // output has exports, so each file is a module and cannot collide with the rest.
  const checking = Date.now()
  const host = ts.createCompilerHost(COMPILER_OPTIONS)
  const {readFile, fileExists} = host
  host.readFile = f => outputs.get(f) ?? readFile.call(host, f)
  host.fileExists = f => outputs.has(f) || fileExists.call(host, f)
  const program = ts.createProgram([...outputs.keys()], COMPILER_OPTIONS, host)
  const setup = [...program.getOptionsDiagnostics(), ...program.getGlobalDiagnostics()]
  if (setup.length) failures.push(`compiler setup: ${setup.map(formatDiagnostic).join('; ')}`)
  let diagnostics = 0
  for (const file of outputs.keys()) {
    const found = ts.getPreEmitDiagnostics(program, program.getSourceFile(file))
    if (!found.length) continue
    diagnostics += found.length
    failures.push(
      `${file}: ${found.length} diagnostic(s)\n` +
        found
          .slice(0, 10)
          .map(d => '    ' + formatDiagnostic(d))
          .join('\n') +
        (found.length > 10 ? `\n    ... and ${found.length - 10} more` : ''),
    )
  }
  console.log(`type-checked ${outputs.size} outputs in ${seconds(checking)} s: ${diagnostics} diagnostic(s)`)

  if (failures.length) {
    console.log(`\nFAIL: ${failures.length} output(s) did not compile cleanly\n`)
    for (const f of failures) console.log(f + '\n')
    if (!args.out) console.log('Re-run with --out <dir> to read the generated files.')
    process.exit(1)
  }
  console.log(
    `\nOK: ${entries.length} schemas x ${variants.length} option sets compile and type-check (${seconds(started)} s)`,
  )
}

function formatDiagnostic(d) {
  const message = ts.flattenDiagnosticMessageText(d.messageText, ' ')
  if (!d.file || d.start === undefined) return `TS${d.code}: ${message}`
  const {line, character} = d.file.getLineAndCharacterOfPosition(d.start)
  return `TS${d.code} at ${line + 1}:${character + 1}: ${message}`
}

const seconds = since => ((Date.now() - since) / 1000).toFixed(1)

main().catch(e => {
  console.error(e)
  process.exit(1)
})
