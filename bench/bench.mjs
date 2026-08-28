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
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {cpus, tmpdir, totalmem} from 'node:os'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import v8 from 'node:v8'
import vm from 'node:vm'
import minimist from 'minimist'

const SELF = fileURLToPath(import.meta.url)
const HERE = dirname(SELF)
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

function libraryPath(src) {
  return src ? join(ROOT, 'src/index.ts') : join(ROOT, 'dist/src/index.js')
}

async function main(opts) {
  if (opts.help) {
    console.log(readFileSync(join(HERE, 'README.md'), 'utf8'))
    return
  }
  if (!existsSync(libraryPath(opts.src))) {
    throw new Error(`${libraryPath(opts.src)} not found: run \`bun run build:server\` first (or pass --src under bun)`)
  }
  const formats = opts.format === 'both' ? [false, true] : [String(opts.format) === 'true']
  const only = opts.only ? String(opts.only).split(',') : null
  const cases = CASES.filter(c => !only || only.includes(c.name))
  const profileDir = opts.profile ? join(HERE, 'profiles') : null
  if (profileDir && isBun) {
    throw new Error('--profile needs node (it relies on V8 flags: --cpu-prof, --heap-prof)')
  }
  if (profileDir) {
    mkdirSync(profileDir, {recursive: true})
  }
  const env = envInfo()

  console.log(`${env.runtime} on ${env.platform}, ${env.cpus}, ${env.memGB} GB; git ${env.gitSha}`)
  console.log(`library: ${opts.src ? 'src/' : 'dist/'}   warm-up: 1   timed runs per case: ${opts.runs}\n`)

  // The child gets each case as a plain JSON file, so that loading it (transpiling a test/e2e
  // module takes longer than some compiles) stays out of the process being measured
  const caseDir = mkdtempSync(join(tmpdir(), 'jstt-bench-'))
  const results = []
  try {
    for (const c of cases) {
      writeFileSync(join(caseDir, `${c.name}.json`), JSON.stringify(loadCase(c)))
    }
    for (const format of formats) {
      for (const c of cases) {
        results.push(runCase(c, format, opts, caseDir, profileDir))
      }
      printTable(
        format,
        results.filter(_ => _.format === format),
      )
    }
  } finally {
    rmSync(caseDir, {recursive: true, force: true})
  }
  if (opts.json) {
    writeFileSync(
      opts.json,
      JSON.stringify({env, library: opts.src ? 'src' : 'dist', runs: opts.runs, results}, null, 2),
    )
    console.log(`wrote ${opts.json}`)
  }
  if (profileDir) {
    console.log(`profiles in ${profileDir}`)
  }
}

/** One case × format setting in a fresh child process; returns the child's result line, parsed */
function runCase(c, format, opts, caseDir, profileDir) {
  const execArgs = []
  if (!isBun) {
    execArgs.push('--expose-gc', '--max-old-space-size=4096')
    if (opts.profile === 'cpu') {
      execArgs.push(
        '--cpu-prof',
        '--cpu-prof-dir',
        profileDir,
        '--cpu-prof-name',
        `${c.name}.format-${format}.cpuprofile`,
      )
    }
    if (opts.profile === 'heap') {
      execArgs.push(
        '--heap-prof',
        '--heap-prof-dir',
        profileDir,
        '--heap-prof-name',
        `${c.name}.format-${format}.heapprofile`,
      )
    }
  }
  const childArgs = [
    '--child',
    join(caseDir, `${c.name}.json`),
    '--format',
    String(format),
    '--runs',
    String(opts.runs),
  ]
  const r = spawnSync(process.execPath, [...execArgs, SELF, ...(opts.src ? ['--src'] : []), ...childArgs], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1 << 26,
    env: childEnv(),
  })
  const line = r.stdout.split('\n').find(_ => _.startsWith('{"name"'))
  if (r.status !== 0 || !line) {
    console.error(r.stdout, r.stderr)
    throw new Error(`case ${c.name} (format: ${format}) failed`)
  }
  return JSON.parse(line)
}

async function child(opts) {
  const {compile} = opts.src ? await import(libraryPath(true)) : require(libraryPath(false))
  const {name, schema, options} = JSON.parse(readFileSync(opts.child, 'utf8'))
  const compileOptions = {
    ...options,
    format: String(opts.format) === 'true',
    $refOptions: {resolve: {http: fixturesResolver}},
  }
  const gc = globalThis.gc ?? (globalThis.Bun ? () => globalThis.Bun.gc(true) : () => {})

  const times = []
  let peakHeap = 0
  let output = ''
  for (let i = 0; i <= opts.runs; i++) {
    gc()
    const t0 = performance.now()
    output = await compile(schema, name, compileOptions)
    const ms = performance.now() - t0
    // total_heap_size is what V8 has committed; right after a compile it still reflects that
    // compile's high-water mark (the heap shrinks lazily), so the max over runs approximates peak heap
    peakHeap = Math.max(peakHeap, v8.getHeapStatistics().total_heap_size)
    if (i > 0) {
      times.push(ms) // run 0 is the warm-up
    }
  }
  console.log(
    JSON.stringify({
      name,
      format: compileOptions.format,
      schemaBytes: JSON.stringify(schema).length,
      outputBytes: output.length,
      outputMd5: createHash('md5').update(output).digest('hex'),
      times,
      medianMs: median(times),
      minMs: Math.min(...times),
      peakHeapMB: mb(peakHeap),
      maxRssMB: Math.round(process.resourceUsage().maxRSS / 1024),
    }),
  )
}

/** A case as `{name, schema, options}`, JSON-serializable */
function loadCase(c) {
  if (c.file) {
    return {name: c.name, schema: JSON.parse(readFileSync(join(HERE, c.file), 'utf8')), options: c.options ?? {}}
  }
  // test/e2e cases are TypeScript modules exporting `input` and maybe `options` (cf. loadTestCase in
  // test/e2eCases.ts); transpile so that plain node can load them without a loader
  const ts = require('typescript')
  const source = readFileSync(join(ROOT, 'test', 'e2e', c.e2e), 'utf8')
  const {outputText} = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
  })
  const mod = {exports: {}}
  vm.runInThisContext(`(function (exports, require, module) {${outputText}\n})`)(mod.exports, require, mod)
  const {input, options = {}} = mod.exports
  return {name: c.name, schema: input, options: {...options, ...c.options}}
}

// Remote $refs are answered from the test suite's on-disk cache -- test/__fixtures__, one file per
// URL named as test/http.ts names them -- never the network. File contents are read once per process,
// so the timed runs measure compile(), not the disk; they are parsed per call because compile()
// works on the objects it is given.
const fixtureText = new Map()
const fixturesResolver = {
  order: 1,
  canRead: /^https?:/i,
  read({url}) {
    if (!fixtureText.has(url)) {
      const path = join(ROOT, 'test', '__fixtures__', url.replace(/[:/\\]/g, '-'))
      if (!existsSync(path)) {
        throw new Error(`no cached copy of ${url} in test/__fixtures__ (the benchmark does not touch the network)`)
      }
      fixtureText.set(url, readFileSync(path, 'utf8'))
    }
    return JSON.parse(fixtureText.get(url))
  },
}

// VERBOSE would make compile() log every phase
function childEnv() {
  const env = {...process.env}
  delete env.VERBOSE
  return env
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
  body.push([
    'TOTAL',
    '',
    '',
    Math.round(sum(rows.map(_ => _.medianMs))),
    Math.round(sum(rows.map(_ => _.minMs))),
    Math.max(...rows.map(_ => _.peakHeapMB)),
    Math.max(...rows.map(_ => _.maxRssMB)),
    '',
  ])
  console.log(`format: ${format}`)
  console.log(markdownTable([header, ...body]))
  console.log()
}

function markdownTable(rows) {
  const widths = rows[0].map((_, i) => Math.max(...rows.map(r => String(r[i]).length)))
  const line = r =>
    '| ' + r.map((c, i) => (i === 0 ? String(c).padEnd(widths[i]) : String(c).padStart(widths[i]))).join(' | ') + ' |'
  return [line(rows[0]), '|' + widths.map(w => '-'.repeat(w + 2)).join('|') + '|', ...rows.slice(1).map(line)].join(
    '\n',
  )
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

const opts = minimist(process.argv.slice(2), {
  string: ['format', 'only', 'json', 'profile', 'child', 'runs'],
  boolean: ['src', 'help'],
  alias: {h: 'help'},
  default: {format: 'both', runs: 5},
  unknown: flag => {
    throw new Error(`unknown flag ${flag}`)
  },
})
opts.runs = Number(opts.runs)
if (opts.child) {
  await child(opts)
} else {
  await main(opts)
}
