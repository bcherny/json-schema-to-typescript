#!/usr/bin/env node
/**
 * Spec-conformance gate: push every JSON-Schema-Test-Suite group (and a fixed,
 * seeded set of recombinations of them, see mutate.js) through compile() and the
 * TypeScript compiler, count for each group how many spec-valid instances the
 * generated type rejects and how many spec-invalid ones it accepts, and compare
 * with test/conformance/baseline.json. See README.md.
 *
 *   bun run build:server
 *   node test/conformance/run.js               # check against the baseline (exit 1 on any difference)
 *   node test/conformance/run.js --update      # rewrite the baseline
 *        [--suite <JSON-Schema-Test-Suite checkout>] [--jobs <n>] [--filter <substring of a group id>] [--report <file>]
 *
 * Without --suite the suite is fetched once, at the pinned commit, into
 * node_modules/.cache/. --report writes every group's row, with the offending
 * instances and compiler messages, as JSON.
 */
const {execFileSync, fork} = require('child_process')
const {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} = require('fs')
const minimist = require('minimist')
const {availableParallelism} = require('os')
const {join, resolve} = require('path')

const SUITE_REPO = 'https://github.com/json-schema-org/JSON-Schema-Test-Suite'
const SUITE_COMMIT = '3c25e5f709192aadf67cf7f2eb19771a57131fec'
const DRAFTS = ['draft4', 'draft6', 'draft7', 'draft2019-09', 'draft2020-12']
const MUTATION_SEED = 1
const MUTATION_COUNT = 1000
const BASELINE = join(__dirname, 'baseline.json')
const COLUMNS = ['valid instances rejected', 'valid instances', 'invalid instances accepted', 'invalid instances']

const ROOT = join(__dirname, '..', '..')
const GROUP_TIMEOUT_MS = 30_000 // a suite schema compiles in milliseconds; this only has to tell a hang from a slow machine
const BATCH = 40 // groups per compile + type-check round trip in a worker

if (process.argv[2] === '--worker') worker(process.argv[3])
else
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })

// --------------------------------------------------------------------------- parent

function parseArgs(argv) {
  const defaults = {update: false, suite: '', jobs: Math.min(4, availableParallelism()), filter: '', report: ''}
  const args = minimist(argv, {default: defaults, boolean: ['update'], string: ['suite', 'filter', 'report']})
  const unknown = Object.keys(args)
    .filter(k => k !== '_' && !(k in defaults))
    .concat(args._)
  if (unknown.length) throw new Error(`unknown arguments: ${unknown.join(' ')}; usage: see the header of ${__filename}`)
  return {...args, suite: args.suite ? resolve(args.suite) : fetchSuite(), jobs: Math.max(1, Number(args.jobs) || 1)}
}

function fetchSuite() {
  const dir = join(ROOT, 'node_modules', '.cache', `JSON-Schema-Test-Suite-${SUITE_COMMIT.slice(0, 7)}`)
  if (existsSync(join(dir, 'tests'))) return dir
  console.log(`fetching ${SUITE_REPO} @ ${SUITE_COMMIT.slice(0, 7)} into ${dir}`)
  mkdirSync(dir, {recursive: true})
  const git = (...argv) => execFileSync('git', argv, {cwd: dir, stdio: ['ignore', 'ignore', 'inherit']})
  git('init', '-q')
  git('fetch', '-q', '--depth', '1', SUITE_REPO, SUITE_COMMIT)
  git('checkout', '-q', '--detach', 'FETCH_HEAD')
  return dir
}

/** Every top-level test file of every draft, one entry per group, in a stable order. */
function loadSuite(suite) {
  const groups = []
  for (const draft of DRAFTS) {
    const dir = join(suite, 'tests', draft)
    for (const file of readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .sort()) {
      JSON.parse(readFileSync(join(dir, file), 'utf8')).forEach((g, index) =>
        groups.push({
          id: `${draft}/${file}#${index}`,
          draft,
          file,
          index,
          description: g.description,
          schema: g.schema,
          tests: g.tests,
        }),
      )
    }
  }
  return groups
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const suite = loadSuite(args.suite)
  const {mutate} = require('./mutate')
  const mutations = mutate(suite, {seed: MUTATION_SEED, count: MUTATION_COUNT})
  const groups = [...suite, ...mutations].filter(g => !args.filter || g.id.includes(args.filter))
  console.log(
    `${suite.length} suite groups + ${mutations.length} recombinations${args.filter ? `, ${groups.length} selected` : ''}; ${args.jobs} workers`,
  )

  const started = Date.now()
  const rows = await runAll(groups, args)
  rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  console.log(`${rows.length} groups in ${((Date.now() - started) / 1000).toFixed(1)} s`)
  if (args.report) writeFileSync(args.report, JSON.stringify(rows, null, 1))

  const current = {
    '//': 'Written by `node test/conformance/run.js --update`; compared row by row in CI. See test/conformance/README.md.',
    suite: SUITE_COMMIT,
    mutations: {seed: MUTATION_SEED, count: MUTATION_COUNT},
    columns: COLUMNS,
    totals: totals(rows),
    groups: Object.fromEntries(rows.map(r => [r.id, summary(r)])),
  }
  printTotals(current.totals)

  if (args.update) {
    if (args.filter) throw new Error('--update needs a full run; drop --filter')
    writeFileSync(BASELINE, stringify(current))
    console.log(`\nwrote ${BASELINE}`)
    return
  }
  process.exit(compare(JSON.parse(readFileSync(BASELINE, 'utf8')), current, rows, args.filter) ? 0 : 1)
}

/** What the baseline records for a group: its four counts, or the name of the state that prevented counting. */
const summary = row => (row.state === 'ok' ? row.counts : row.state)

function totals(rows) {
  const t = {groups: rows.length, crash: 0, 'invalid-output': 0, timeout: 0}
  COLUMNS.forEach(c => (t[c] = 0))
  for (const r of rows) {
    if (r.state !== 'ok') t[r.state]++
    else COLUMNS.forEach((c, i) => (t[c] += r.counts[i]))
  }
  return t
}

function printTotals(t) {
  console.log(
    `\n${t.groups} groups: ${t.crash} do not compile, ${t['invalid-output']} compile to TypeScript that does not type-check` +
      (t.timeout ? `, ${t.timeout} timed out` : '') +
      `;\nof the rest, ${t[COLUMNS[0]]} of ${t[COLUMNS[1]]} valid instances are rejected by the generated type ` +
      `and ${t[COLUMNS[2]]} of ${t[COLUMNS[3]]} invalid instances are accepted.`,
  )
}

/** One row per line, so a baseline update reads as a diff. */
function stringify(baseline) {
  const {groups, ...head} = baseline
  const lines = Object.entries(groups).map(([id, v]) => `    ${JSON.stringify(id)}: ${JSON.stringify(v)}`)
  return JSON.stringify(head, null, 2).replace(/\n}$/, ',\n  "groups": {\n' + lines.join(',\n') + '\n  }\n}\n')
}

/**
 * Regressions (a group got worse) and improvements (it got better) both fail the
 * job: the first because that is the point, the second so the baseline keeps
 * saying what master actually does. Prints what moved; returns true if nothing did.
 */
function compare(baseline, current, rows, filtered) {
  if (baseline.suite !== current.suite || JSON.stringify(baseline.mutations) !== JSON.stringify(current.mutations)) {
    console.log(
      `\nFAIL: ${BASELINE} was recorded for another suite commit or mutation seed; re-record it with --update.`,
    )
    return false
  }
  const worse = [],
    better = [],
    gone = []
  for (const row of rows) {
    const was = baseline.groups[row.id],
      now = summary(row)
    if (was === undefined) gone.push(`${row.id}: not in the baseline`)
    else if (JSON.stringify(was) !== JSON.stringify(now))
      (isWorse(was, now) ? worse : better).push(describe(row, was, now))
  }
  if (!filtered)
    for (const id of Object.keys(baseline.groups))
      if (!(id in current.groups)) gone.push(`${id}: in the baseline but not in this run`)

  if (!worse.length && !better.length && !gone.length) {
    console.log(`\nOK: all ${Object.keys(current.groups).length} groups match ${BASELINE.slice(ROOT.length + 1)}`)
    return true
  }
  const annotate = process.env.GITHUB_ACTIONS
    ? (level, s) => console.log(`::${level}::${s.replace(/\n/g, '%0A')}`)
    : () => {}
  if (worse.length) {
    console.log(`\nFAIL: ${worse.length} group(s) regressed against the baseline:\n`)
    worse.forEach(s => console.log(s + '\n'))
    annotate('error', `conformance: ${worse.length} group(s) regressed, first: ${worse[0].split('\n')[0]}`)
  }
  if (better.length) {
    console.log(`\n${worse.length ? 'Also, ' : 'FAIL: '}${better.length} group(s) improved on the baseline:\n`)
    better.forEach(s => console.log(s + '\n'))
    if (!worse.length) {
      console.log('That is good news, but the baseline has to say so: run `node test/conformance/run.js --update`')
      console.log('(after `bun run build:server`) and commit test/conformance/baseline.json with this change.')
      annotate(
        'error',
        `conformance: ${better.length} group(s) improved; re-record test/conformance/baseline.json (see the job log)`,
      )
    }
  }
  if (gone.length) {
    console.log(`\nFAIL: the set of groups changed (${gone.length}); re-record the baseline with --update:\n`)
    gone.slice(0, 20).forEach(s => console.log('  ' + s))
  }
  return false
}

const RANK = {ok: 0, 'invalid-output': 1, crash: 2, timeout: 3}
function isWorse(was, now) {
  if (Array.isArray(was) && Array.isArray(now)) return now[0] > was[0] || now[2] > was[2]
  return RANK[Array.isArray(now) ? 'ok' : now] > RANK[Array.isArray(was) ? 'ok' : was]
}

function describe(row, was, now) {
  const show = v => (Array.isArray(v) ? `rejects ${v[0]}/${v[1]} valid, accepts ${v[2]}/${v[3]} invalid` : v)
  let s = `${row.id} (${row.description})\n    was: ${show(was)}\n    now: ${show(now)}`
  if (row.state === 'crash' || row.state === 'timeout') s += `\n    ${row.detail.message}`
  if (row.state === 'invalid-output') s += row.detail.diagnostics.map(d => `\n    ${d}`).join('')
  if (row.state === 'ok' && Array.isArray(was)) {
    if (now[0] > was[0])
      s += row.detail.rejectsValid.map(f => `\n    rejects ${JSON.stringify(f.data)}: ${f.message}`).join('')
    if (now[2] > was[2]) s += row.detail.acceptsInvalid.map(f => `\n    accepts ${JSON.stringify(f.data)}`).join('')
  }
  return s
}

/** Hand the groups to `jobs` worker processes BATCH at a time; a worker that goes quiet is killed and replaced. */
function runAll(groups, args) {
  const queue = [...groups]
  const rows = []
  let live = 0
  return new Promise(done => {
    const spawn = () => {
      live++
      const child = fork(__filename, ['--worker', args.suite], {stdio: ['ignore', 'inherit', 'inherit', 'ipc']})
      let batch = [],
        current = null,
        timer = null
      const feed = () => {
        batch = queue.splice(0, BATCH)
        child.send(batch.length ? {type: 'batch', groups: batch} : {type: 'done'})
      }
      const hung = () => {
        child.removeAllListeners('exit')
        child.kill('SIGKILL')
        rows.push({
          id: current.id,
          description: current.description,
          state: 'timeout',
          detail: {message: `no answer within ${GROUP_TIMEOUT_MS / 1000} s while compiling this group`},
        })
        queue.unshift(...batch.filter(g => g !== current)) // the rest of its batch goes back on the queue
        live--
        spawn()
      }
      child.on('message', m => {
        clearTimeout(timer)
        if (m.type === 'start') {
          current = batch[m.index]
          timer = setTimeout(hung, GROUP_TIMEOUT_MS)
        } else if (m.type === 'rows') {
          rows.push(...m.rows)
          current = null
          feed()
        }
      })
      child.on('exit', code => {
        clearTimeout(timer)
        live--
        if (batch.length && code !== 0) throw new Error(`worker exited with ${code} mid-batch`)
        if (!live && !queue.length) done(rows)
      })
      feed()
    }
    for (let i = 0; i < Math.min(args.jobs, Math.ceil(groups.length / BATCH)); i++) spawn()
  })
}

// --------------------------------------------------------------------------- worker

function worker(suite) {
  const ts = require('typescript')
  const {compile} = require(join(ROOT, 'dist', 'src'))
  const {Parent} = require(join(ROOT, 'dist', 'src', 'types', 'JSONSchema'))
  const check = typeChecker(ts)

  // Remote $refs in the suite point at http://localhost:1234/, which is its remotes/ directory. Nothing else is served.
  const remotes = {
    order: 1,
    canRead: /^https?:\/\//i,
    read({url}) {
      const m = url.match(/^https?:\/\/localhost:1234\/([^#]*)/)
      if (m) return readFileSync(join(suite, 'remotes', decodeURIComponent(m[1])))
      throw new Error(`remote ${url} is not part of the test suite`)
    },
  }
  const options = {
    bannerComment: '',
    format: false,
    customName: schema => (schema[Parent] === null ? 'Root' : undefined),
    cwd: join(suite, 'remotes') + '/',
    $refOptions: {resolve: {file: false, http: false, suite: remotes}},
  }

  process.on('message', async m => {
    if (m.type === 'done') return process.exit(0)
    const rows = []
    const sources = new Map() // `${n}/out.ts` is group n's output, `${n}/instances.ts` its instances, one per line
    for (const [n, g] of m.groups.entries()) {
      process.send({type: 'start', index: n})
      const row = {id: g.id, description: g.description, state: 'ok'}
      rows.push(row)
      try {
        sources.set(`${n}/out.ts`, await compile(g.schema, 'Root', options))
      } catch (e) {
        row.state = 'crash'
        row.detail = {
          message: String((e && e.message) || e)
            .split('\n')[0]
            .slice(0, 200),
        }
        continue
      }
      const instances = g.tests.map((t, i) => `export const v${i}: Root = ${literal(t.data)}`)
      sources.set(`${n}/instances.ts`, ["import type {Root} from './out'", ...instances].join('\n'))
    }
    const diagnostics = check(sources)
    for (const [n, row] of rows.entries()) {
      if (row.state !== 'ok') continue
      const own = diagnostics.get(`${n}/out.ts`)
      if (own.length || !/^export (interface|type|enum|const enum) Root\b/m.test(sources.get(`${n}/out.ts`))) {
        row.state = 'invalid-output'
        row.detail = {
          diagnostics: own.length ? own.slice(0, 5).map(d => d.message) : ['no `Root` declaration in the output'],
        }
        continue
      }
      const rejected = new Map() // instance index -> first message
      for (const d of diagnostics.get(`${n}/instances.ts`))
        if (d.line > 0 && !rejected.has(d.line - 1)) rejected.set(d.line - 1, d.message)
      const {tests} = m.groups[n]
      row.detail = {rejectsValid: [], acceptsInvalid: []}
      tests.forEach((t, i) => {
        if (t.valid && rejected.has(i)) row.detail.rejectsValid.push({data: t.data, message: rejected.get(i)})
        if (!t.valid && !rejected.has(i)) row.detail.acceptsInvalid.push({data: t.data})
      })
      const valid = tests.filter(t => t.valid).length
      row.counts = [row.detail.rejectsValid.length, valid, row.detail.acceptsInvalid.length, tests.length - valid]
    }
    process.send({type: 'rows', rows})
  })
}

/** JSON is valid TypeScript, except that U+2028/9 may not appear raw in a string literal before ES2019. */
const literal = data =>
  JSON.stringify(data)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

/**
 * Type-check a set of in-memory files as one program (strict, lib.es5 only) and
 * return the diagnostics per file. Each group is its own directory with its own
 * modules, so groups cannot see each other; sharing the program just saves setup,
 * as does parsing the lib files once per worker rather than once per program.
 */
function typeChecker(ts) {
  const options = {strict: true, noEmit: true, types: [], lib: ['lib.es5.d.ts']}
  const VROOT = '/conformance/'
  const host = ts.createCompilerHost(options)
  const {getSourceFile, fileExists, directoryExists} = host
  const libs = new Map()
  let files = new Map() // path -> SourceFile, for the current call
  host.getCurrentDirectory = () => VROOT
  host.fileExists = f => files.has(f) || fileExists.call(host, f)
  host.directoryExists = d => VROOT.startsWith(d) || files.has(d + '/out.ts') || directoryExists.call(host, d)
  host.getSourceFile = (f, ...rest) => {
    if (files.has(f)) return files.get(f)
    if (!libs.has(f)) libs.set(f, getSourceFile.call(host, f, ...rest))
    return libs.get(f)
  }
  return sources => {
    files = new Map(
      [...sources].map(([name, text]) => [
        VROOT + name,
        ts.createSourceFile(VROOT + name, text, ts.ScriptTarget.ES2020),
      ]),
    )
    const program = ts.createProgram({rootNames: [...files.keys()], options, host})
    const setup = [...program.getOptionsDiagnostics(), ...program.getGlobalDiagnostics()]
    if (setup.length)
      throw new Error(
        'compiler setup: ' + setup.map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ')).join('; '),
      )
    const out = new Map()
    for (const [name, sf] of files) {
      out.set(
        name.slice(VROOT.length),
        [...program.getSyntacticDiagnostics(sf), ...program.getSemanticDiagnostics(sf)].map(d => ({
          line: d.start === undefined ? -1 : sf.getLineAndCharacterOfPosition(d.start).line,
          message: `TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 240)}`,
        })),
      )
    }
    return out
  }
}
