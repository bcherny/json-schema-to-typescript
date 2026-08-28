#!/usr/bin/env node
// Compile-time and memory benchmark for compile(). See bench/README.md.
//
//   node bench/bench.mjs            (or: bun bench/bench.mjs)
//   node bench/bench.mjs --format false --runs 3 --only fhir,k8s
//   node bench/bench.mjs --json out.json --profile cpu
//
// Each schema x format runs in a fresh child process (so heap numbers don't bleed between cases):
// one untimed warm-up compile, then `--runs` timed compiles. The child reports every run's
// wall-clock time, the largest V8 heap it saw, and the kernel's peak RSS for the process.

import {spawnSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {cpus, totalmem} from 'node:os'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import v8 from 'node:v8'
import vm from 'node:vm'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const require = createRequire(import.meta.url)
const isBun = Boolean(process.versions.bun)

// The fixed benchmark set: the repo's heaviest e2e fixtures plus a few vendored real-world schemas
// (sources and licences in bench/fixtures/README.md). `options` are compile() options on top of the
// case's own; `format` is overridden per run.
const CASES = [
  {name: 'fhir', e2e: 'realWorld.fhir.ts'},
  {name: 'azure', e2e: 'realWorld.azureDeploymentTemplate.ts'}, // ~60 remote $refs, served from test/__fixtures__
  {name: 'payloadCMS', e2e: 'realWorld.payloadCMS.ts'},
  {name: 'heroku', e2e: 'realWorld.heroku.ts'},
  {name: 'openapi', e2e: 'realWorld.openapi.ts'},
  {name: 'awsQuicksight', e2e: 'realWorld.awsQuicksight.ts'},
  {name: 'k8s', file: 'fixtures/kubernetes-definitions-v1.30.0.json', options: {unreachableDefinitions: true}},
  {name: 'tsconfig', file: 'fixtures/tsconfig.json'},
  {name: 'githubWorkflow', file: 'fixtures/github-workflow.json'},
]

function parseArgs(argv) {
  const out = {format: 'both', runs: 5, only: null, json: null, profile: null, src: false, child: null}
  for (let i = 0; i < argv.length; i++) {
    const [k, inline] = argv[i].replace(/^--/, '').split('=')
    const next = () => inline ?? argv[++i]
    switch (k) {
      case 'format':
        out.format = next()
        break
      case 'runs':
        out.runs = Number(next())
        break
      case 'only':
        out.only = next().split(',')
        break
      case 'json':
        out.json = next()
        break
      case 'profile':
        out.profile = next() // cpu | heap
        break
      case 'src':
        out.src = true // load src/ instead of dist/ (bun only)
        break
      case 'child':
        out.child = {name: next(), format: argv[++i] === 'true', runs: Number(argv[++i])}
        break
      case 'help':
      case 'h':
        console.log(readFileSync(join(HERE, 'README.md'), 'utf8'))
        process.exit(0)
        break
      default:
        throw new Error(`unknown flag --${k}`)
    }
  }
  return out
}

async function main(opts) {
  const lib = opts.src ? join(ROOT, 'src/index.ts') : join(ROOT, 'dist/src/index.js')
  if (!existsSync(lib)) {
    throw new Error(`${lib} not found: run \`bun run build:server\` first (or pass --src under bun)`)
  }
  const formats = opts.format === 'both' ? [false, true] : [opts.format === 'true']
  const cases = CASES.filter(c => !opts.only || opts.only.includes(c.name))
  const profileDir = opts.profile ? join(ROOT, 'bench', 'profiles') : null
  if (profileDir) mkdirSync(profileDir, {recursive: true})

  console.log(envLine())
  console.log(`library: ${opts.src ? 'src/' : 'dist/'}   warm-up: 1   timed runs per case: ${opts.runs}\n`)

  const results = []
  for (const format of formats) {
    const rows = []
    for (const c of cases) {
      const execArgs = []
      if (!isBun) execArgs.push('--expose-gc', '--max-old-space-size=4096')
      if (opts.profile === 'cpu' && !isBun) execArgs.push('--cpu-prof', '--cpu-prof-dir', profileDir, '--cpu-prof-name', `${c.name}.format-${format}.cpuprofile`)
      if (opts.profile === 'heap' && !isBun) execArgs.push('--heap-prof', '--heap-prof-dir', profileDir, '--heap-prof-name', `${c.name}.format-${format}.heapprofile`)
      const r = spawnSync(
        process.execPath,
        [...execArgs, fileURLToPath(import.meta.url), ...(opts.src ? ['--src'] : []), '--child', c.name, String(format), String(opts.runs)],
        {cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26, env: childEnv()},
      )
      const line = r.stdout.split('\n').find(_ => _.startsWith('{"name"'))
      if (r.status !== 0 || !line) {
        console.error(r.stdout, r.stderr)
        throw new Error(`case ${c.name} (format: ${format}) failed`)
      }
      const res = JSON.parse(line)
      rows.push(res)
      results.push(res)
    }
    printTable(format, rows)
  }

  if (opts.json) {
    writeFileSync(opts.json, JSON.stringify({env: envInfo(), library: opts.src ? 'src' : 'dist', runs: opts.runs, results}, null, 2))
    console.log(`wrote ${opts.json}`)
  }
  if (profileDir) console.log(`profiles in ${profileDir}`)
}

async function child({child: {name, format, runs}, src}) {
  const c = CASES.find(_ => _.name === name)
  const {compile} = src ? await import(join(ROOT, 'src/index.ts')) : require(join(ROOT, 'dist/src/index.js'))
  const {schema, options} = loadCase(c)
  const compileOptions = {...options, ...c.options, format, $refOptions: {resolve: {http: fixturesResolver}}}
  const gc = globalThis.gc ?? (globalThis.Bun ? () => globalThis.Bun.gc(true) : () => {})

  const times = []
  let peakHeap = 0
  let output = ''
  for (let i = 0; i <= runs; i++) {
    gc()
    const t0 = performance.now()
    output = await compile(schema, c.name, compileOptions)
    const ms = performance.now() - t0
    // total_heap_size is what V8 has committed; right after a compile it still reflects that
    // compile's high-water mark (the heap shrinks lazily), so the max over runs approximates peak heap
    const h = v8.getHeapStatistics()
    peakHeap = Math.max(peakHeap, h.total_heap_size, h.used_heap_size)
    if (i > 0) times.push(ms) // run 0 is the warm-up
  }
  gc()
  const retainedHeap = v8.getHeapStatistics().used_heap_size
  console.log(
    JSON.stringify({
      name,
      format,
      schemaBytes: JSON.stringify(schema).length,
      outputBytes: output.length,
      outputMd5: createHash('md5').update(output).digest('hex'),
      times,
      medianMs: median(times),
      minMs: Math.min(...times),
      peakHeapMB: mb(peakHeap),
      retainedHeapMB: mb(retainedHeap),
      maxRssMB: Math.round(process.resourceUsage().maxRSS / 1024),
    }),
  )
}

function loadCase(c) {
  if (c.file) {
    return {schema: JSON.parse(readFileSync(join(HERE, c.file), 'utf8')), options: {}}
  }
  // test/e2e cases are TypeScript modules exporting `input` and maybe `options`; transpile so that
  // any node version (and bun) can load them without a loader
  const ts = require('typescript')
  const source = readFileSync(join(ROOT, 'test', 'e2e', c.e2e), 'utf8')
  const {outputText} = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019}})
  const mod = {exports: {}}
  vm.runInThisContext(`(function (exports, require, module) {${outputText}\n})`)(mod.exports, require, mod)
  const {input, options = {}} = mod.exports
  return {schema: input, options}
}

// Remote $refs are answered from the test suite's on-disk cache (test/__fixtures__), never the network
const fixturesResolver = {
  order: 1,
  canRead: /^https?:/i,
  read({url}) {
    const path = join(ROOT, 'test', '__fixtures__', url.replace(/[:/\\]/g, '-'))
    if (!existsSync(path)) {
      throw new Error(`no cached copy of ${url} in test/__fixtures__ (the benchmark does not touch the network)`)
    }
    return JSON.parse(readFileSync(path, 'utf8'))
  },
}

function printTable(format, rows) {
  const header = ['case', 'schema KB', 'output KB', 'median ms', 'min ms', 'peak heap MB', 'max RSS MB', 'output md5']
  const body = rows.map(r => [
    r.name,
    kb(r.schemaBytes),
    kb(r.outputBytes),
    Math.round(r.medianMs),
    Math.round(r.minMs),
    r.peakHeapMB,
    r.maxRssMB,
    r.outputMd5.slice(0, 8),
  ])
  body.push(['TOTAL', '', '', Math.round(sum(rows.map(_ => _.medianMs))), Math.round(sum(rows.map(_ => _.minMs))), Math.max(...rows.map(_ => _.peakHeapMB)), Math.max(...rows.map(_ => _.maxRssMB)), ''])
  console.log(`format: ${format}`)
  console.log(markdownTable([header, ...body]))
  console.log()
}

function markdownTable(rows) {
  const widths = rows[0].map((_, i) => Math.max(...rows.map(r => String(r[i]).length)))
  const line = r => '| ' + r.map((c, i) => (i === 0 ? String(c).padEnd(widths[i]) : String(c).padStart(widths[i]))).join(' | ') + ' |'
  return [line(rows[0]), '|' + widths.map(w => '-'.repeat(w + 2)).join('|') + '|', ...rows.slice(1).map(line)].join('\n')
}

// VERBOSE would make compile() log every phase; CI is irrelevant but noisy in some setups
function childEnv() {
  const env = {...process.env}
  delete env.VERBOSE
  return env
}

function envInfo() {
  return {
    runtime: isBun ? `bun ${process.versions.bun}` : `node ${process.versions.node}`,
    platform: `${process.platform} ${process.arch}`,
    cpus: `${cpus().length} x ${cpus()[0]?.model ?? '?'}`,
    memGB: Math.round(totalmem() / 2 ** 30),
    gitSha: spawnSync('git', ['rev-parse', '--short', 'HEAD'], {cwd: ROOT, encoding: 'utf8'}).stdout.trim(),
  }
}

function envLine() {
  const e = envInfo()
  return `${e.runtime} on ${e.platform}, ${e.cpus}, ${e.memGB} GB; git ${e.gitSha}`
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
function sum(xs) {
  return xs.reduce((a, b) => a + b, 0)
}
function mb(bytes) {
  return Math.round(bytes / 2 ** 20)
}
function kb(bytes) {
  return Math.round(bytes / 1024)
}

const args = parseArgs(process.argv.slice(2))
if (args.child) {
  await child(args)
} else {
  await main(args)
}
