#!/usr/bin/env node
/**
 * perf-fuzz: time-and-memory fuzz harness for json-schema-to-typescript's compile().
 *
 *   node perf-fuzz.js sweep   [--families a,b,…] [--ns 25,50,…] [--seed 1] [--budget 10000] [--heap 512]
 *                             [--format false|true|both] [--jstt <repo>] [--out results.jsonl] [--jobs 2]
 *   node perf-fuzz.js one     --family F --n N [--seed 1] [--format …] [--profile <dir>] [--keep <dir>]
 *   node perf-fuzz.js corpus  <dir> [--budget 60000] [--heap 1024] [--format both] [--http-cache <dir>] [--warm false] [--out …]
 *   node perf-fuzz.js file    <schema.json> [--options '{…}' (else <schema>.options.json)] [--profile <dir>] [--emit out.d.ts]
 *   node perf-fuzz.js baseline [--reps 10]
 *   node perf-fuzz.js report  <results.jsonl> [--md out.md]
 *   node perf-fuzz.js families
 *
 * Every compile runs in a fresh `node --max-old-space-size=<heap> run-one.js` child with a
 * wall-clock budget; outcome is one of ok / throw / stack / timeout / overbudget / oom / crash
 * (+ skipped / generror rows in a sweep).
 * `ms` is compile() time measured inside the child (hrtime); `wallMs` includes process
 * spawn + require (see `baseline`). Deterministic from --seed.
 */
const {spawn, spawnSync} = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const {generate, META} = require('./gen')

const RUN_ONE = path.join(__dirname, 'run-one.js')
const DEFAULT_NS = [25, 50, 100, 200, 400, 800, 1600, 3200]

function parseArgs(argv) {
  const a = {_: []}
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i]
    if (t.startsWith('--')) {
      const [k, v] = t.includes('=') ? t.slice(2).split(/=(.*)/s) : [t.slice(2), argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true']
      a[k] = v
    } else a._.push(t)
  }
  return a
}
const args = parseArgs(process.argv.slice(2))
const mode = args._[0] || 'families'
const JSTT = path.resolve(args.jstt || process.env.JSTT_REPO || path.join(__dirname, '../..'))
const SEED = Number(args.seed || 1)
const BUDGET = Number(args.budget || (mode === 'corpus' ? 60000 : 10000))
const HEAP = Number(args.heap || (mode === 'corpus' ? 1024 : 512))
const PROFILE = args.profile ? path.resolve(args.profile) : null // one/file: run the child under --cpu-prof
const EMIT = args.emit ? path.resolve(args.emit) : null // one/file: write the generated .d.ts here
const HTTP_CACHE = args['http-cache'] ? path.resolve(args['http-cache']) : null
const FORMATS = (args.format || (mode === 'sweep' || mode === 'corpus' ? 'both' : 'false')) === 'both' ? [false, true] : [args.format === 'true']
const OUT = args.out ? fs.createWriteStream(args.out, {flags: 'a'}) : null
const WORK = args.keep ? path.resolve(args.keep) : fs.mkdtempSync(path.join(os.tmpdir(), 'jstt-perf-'))
fs.mkdirSync(WORK, {recursive: true})

if (!fs.existsSync(path.join(JSTT, 'dist/src/index.js'))) {
  console.error(`no dist/src/index.js under ${JSTT} — run \`npm run build:server\` there or pass --jstt <repo>`)
  process.exit(2)
}

function record(row) {
  const line = JSON.stringify(row)
  if (OUT) OUT.write(line + '\n')
  const flag = row.outcome === 'ok' ? (row.ms > 1000 ? ' SLOW' : '') : ' <<<'
  console.log(
    `${(row.family || row.file || '').padEnd(38)} n=${String(row.n ?? '-').padEnd(6)} fmt=${row.format ? 'T' : 'F'} ${row.outcome.padEnd(7)} ${String(row.ms ?? '-').padStart(9)}ms wall=${String(row.wallMs).padStart(6)} rss=${String(row.maxRssMB ?? '-').padStart(6)}MB out=${row.outBytes ?? '-'}${flag}${row.message ? '  ' + row.message.slice(0, 90) : ''}`,
  )
  return row
}

/** write a generated case (root schema + any external-$ref files) to dir; returns the case.json path */
function materialise(gen, dir) {
  fs.mkdirSync(dir, {recursive: true})
  for (const [rel, doc] of Object.entries(gen.files || {})) {
    const p = path.join(dir, rel)
    fs.mkdirSync(path.dirname(p), {recursive: true})
    fs.writeFileSync(p, JSON.stringify(doc))
  }
  if (gen.rootFile) fs.writeFileSync(path.join(dir, gen.rootFile), JSON.stringify(gen.schema))
  fs.writeFileSync(path.join(dir, 'schema.json'), JSON.stringify(gen.schema, null, 1)) // for humans / issue repros
  return writeCase(dir, {schema: gen.schema, options: gen.options || {}, cwd: dir + '/', name: 'PerfRoot'})
}

function writeCase(dir, c, basename = 'case.json') {
  fs.mkdirSync(dir, {recursive: true})
  const casePath = path.join(dir, basename)
  fs.writeFileSync(casePath, JSON.stringify(c))
  return casePath
}

/** case for an on-disk schema: options from --options or the `<name>.options.json` sidecar; cwd = options.cwd (may be a URL, e.g. schemastore siblings) or the file's directory */
function fileCase(file, outDir) {
  const sidecar = file.replace(/\.json$/, '.options.json')
  const options = args.options ? JSON.parse(args.options) : fs.existsSync(sidecar) ? JSON.parse(fs.readFileSync(sidecar, 'utf8')) : {}
  const schema = JSON.parse(fs.readFileSync(file, 'utf8'))
  const casePath = writeCase(outDir, {schema, options, cwd: options.cwd || path.dirname(file) + '/', name: path.basename(file, '.json')}, path.basename(file) + '.case.json')
  return {casePath, size: fs.statSync(file).size}
}

/** run one case file in a child; resolves to a result row */
function runChild(casePath, {format, budget = BUDGET, heap = HEAP, profileDir = null, httpCache = null, emit = null}) {
  return new Promise(resolve => {
    const nodeArgs = [`--max-old-space-size=${heap}`]
    if (profileDir) nodeArgs.push('--cpu-prof', `--cpu-prof-dir=${profileDir}`, '--cpu-prof-interval=250')
    const childArgs = [...nodeArgs, RUN_ONE, casePath, '--jstt', JSTT, '--format', String(format)]
    if (httpCache) childArgs.push('--http-cache', httpCache)
    if (emit) childArgs.push('--emit', emit)
    const t0 = Date.now()
    const child = spawn(process.execPath, childArgs, {stdio: ['ignore', 'pipe', 'pipe'], env: {...process.env, VERBOSE: ''}})
    let stdout = ''
    let stderr = ''
    const keepTail = (buf, d) => (buf.length + d.length > 200000 ? (buf + d).slice(-100000) : buf + d)
    child.stdout.on('data', d => (stdout = keepTail(stdout, d)))
    child.stderr.on('data', d => (stderr = keepTail(stderr, d)))
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, budget + (profileDir ? 60000 : 1500)) // grace for boot; profile writes take a while
    child.on('close', (code, signal) => {
      clearTimeout(timer)
      const wallMs = Date.now() - t0
      const line = stdout.split('\n').find(l => l.startsWith('__PERF__ '))
      let r
      if (line) {
        r = JSON.parse(line.slice(9))
        if (r.outcome === 'ok' && r.ms > budget) r.outcome = 'overbudget'
      } else if (/heap out of memory|Allocation failed - JavaScript heap|FatalProcessOutOfMemory/i.test(stderr)) {
        r = {outcome: 'oom', message: `exceeded ${heap} MB heap`}
      } else if (timedOut) {
        r = {outcome: 'timeout', message: `exceeded ${budget} ms`}
      } else if (/Maximum call stack size exceeded/.test(stderr)) {
        r = {outcome: 'stack', message: (stderr.match(/RangeError.*\n\s+at .*/) || ['Maximum call stack size exceeded'])[0].replace(/\s+/g, ' ').slice(0, 200)}
      } else {
        r = {outcome: 'crash', message: `exit ${code} signal ${signal}: ${stderr.trim().split('\n').slice(-3).join(' | ').slice(0, 300)}`}
      }
      r.wallMs = wallMs
      r.format = format
      resolve(r)
    })
  })
}

async function pool(items, jobs, fn) {
  const q = items.slice()
  const workers = Array.from({length: jobs}, async () => {
    while (q.length) await fn(q.shift())
  })
  await Promise.all(workers)
}

// ─────────────────────────────────────────────────────────────────────────────
async function sweep() {
  const fams = args.families ? args.families.split(',') : Object.keys(META).filter(f => META[f].scaling !== false)
  const ns = args.ns ? args.ns.split(',').map(Number) : DEFAULT_NS
  const jobs = Number(args.jobs || 1)
  console.log(`# sweep jstt=${JSTT} seed=${SEED} budget=${BUDGET}ms heap=${HEAP}MB formats=${FORMATS} ns=${ns} families=${fams.length} work=${WORK}`)
  await pool(fams, jobs, async fam => {
    const stopped = {} // format -> true once a run failed/timed out (skip larger n)
    for (const n of ns) {
      if (n > META[fam].cap) break
      if (FORMATS.every(f => stopped[f])) {
        for (const format of FORMATS) record({mode: 'sweep', family: fam, n, seed: SEED, format, outcome: 'skipped', message: 'smaller n already failed', wallMs: 0})
        continue
      }
      let gen
      try {
        gen = generate(fam, n, SEED)
      } catch (e) {
        record({mode: 'sweep', family: fam, n, seed: SEED, outcome: 'generror', message: String(e.message)})
        break
      }
      const casePath = materialise(gen, path.join(WORK, `${fam}-n${n}-s${SEED}`))
      const schemaBytes = fs.statSync(casePath).size
      for (const format of FORMATS) {
        if (stopped[format]) {
          record({mode: 'sweep', family: fam, n, seed: SEED, format, outcome: 'skipped', message: 'smaller n already failed', wallMs: 0})
          continue
        }
        const r = await runChild(casePath, {format})
        record({mode: 'sweep', family: fam, n, seed: SEED, schemaBytes, ...r})
        if (r.outcome !== 'ok') stopped[format] = true
      }
    }
  })
  console.log(`# done; cases kept in ${WORK}`)
}

async function one() {
  const fam = args.family
  const n = Number(args.n || 100)
  const gen = generate(fam, n, SEED)
  const dir = path.join(WORK, `${fam}-n${n}-s${SEED}`)
  const casePath = materialise(gen, dir)
  for (const format of FORMATS) {
    const r = await runChild(casePath, {format, profileDir: PROFILE, emit: EMIT})
    record({mode: 'one', family: fam, n, seed: SEED, ...r})
  }
  console.log(`# case dir: ${dir}`)
  if (PROFILE) summariseProfiles(PROFILE)
}

async function fileMode() {
  const file = path.resolve(args._[1])
  const {casePath, size} = fileCase(file, path.join(WORK, 'files'))
  for (const format of FORMATS) {
    const r = await runChild(casePath, {format, profileDir: PROFILE, emit: EMIT, httpCache: HTTP_CACHE})
    record({mode: 'file', file: path.basename(file), schemaBytes: size, ...r})
  }
  if (PROFILE) summariseProfiles(PROFILE)
}

async function corpus() {
  const dir = path.resolve(args._[1])
  const files = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.endsWith('.options.json'))
    .sort()
  const httpCache = HTTP_CACHE || path.join(dir, '.http-cache')
  const cases = files.map(f => ({file: f, ...fileCase(path.join(dir, f), path.join(WORK, 'corpus'))}))
  console.log(`# corpus ${dir}: ${files.length} schemas, budget=${BUDGET}ms heap=${HEAP}MB formats=${FORMATS}`)
  if (args.warm !== 'false') {
    // untimed warm-up pass so remote $refs are cached on disk
    console.log('# warm-up pass (fills http cache, not recorded)…')
    for (const c of cases) {
      const r = await runChild(c.casePath, {format: false, budget: Math.max(BUDGET, 120000), httpCache})
      if (r.outcome !== 'ok') console.log(`#   warm ${c.file}: ${r.outcome} ${r.message || ''}`)
    }
  }
  for (const c of cases) {
    for (const format of FORMATS) {
      const r = await runChild(c.casePath, {format, httpCache})
      record({mode: 'corpus', file: c.file, schemaBytes: c.size, ...r})
    }
  }
}

async function baseline() {
  const reps = Number(args.reps || 10)
  const casePath = writeCase(path.join(WORK, 'baseline'), {schema: {type: 'object', properties: {a: {type: 'string'}}}, options: {}})
  const rows = []
  for (let i = 0; i < reps; i++) for (const format of [false, true]) rows.push(await runChild(casePath, {format}))
  const med = xs => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)]
  for (const format of [false, true]) {
    const rs = rows.filter(r => r.format === format)
    console.log(`baseline format=${format}: median wall=${med(rs.map(r => r.wallMs))}ms boot(require dist)=${med(rs.map(r => r.bootMs))}ms compile(trivial)=${med(rs.map(r => r.ms))}ms rss=${med(rs.map(r => r.maxRssMB))}MB (n=${rs.length})`)
    record({mode: 'baseline', family: 'baseline', n: 1, format, outcome: 'ok', ms: med(rs.map(r => r.ms)), wallMs: med(rs.map(r => r.wallMs)), bootMs: med(rs.map(r => r.bootMs)), maxRssMB: med(rs.map(r => r.maxRssMB))})
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/** log-log slope between successive ok points; > ~1.3 = super-linear */
function analyse(rows) {
  // constant per-compile overhead (dereference setup, first prettier call) measured by `baseline`;
  // subtract it so slopes describe the n-dependent part only
  const base = {false: 0, true: 0}
  for (const r of rows) if (r.mode === 'baseline') base[r.format] = r.ms
  const byFam = {}
  for (const r of rows) {
    if (r.mode !== 'sweep' && r.mode !== 'one') continue
    const k = `${r.family}|${r.format}`
    ;(byFam[k] = byFam[k] || []).push(r)
  }
  const out = []
  for (const rs of Object.values(byFam)) {
    const {family, format} = rs[0]
    rs.sort((a, b) => a.n - b.n)
    const b = base[format] || 0
    const ok = rs.filter(r => r.outcome === 'ok' && r.ms - b >= 30) // below ~30 ms over baseline is noise
    const slopes = []
    for (let i = 1; i < ok.length; i++) slopes.push(Math.log((ok[i].ms - b) / (ok[i - 1].ms - b)) / Math.log(ok[i].n / ok[i - 1].n))
    const tail = slopes.slice(-2)
    const slope = tail.length ? tail.reduce((a, b) => a + b, 0) / tail.length : null
    const fail = rs.find(r => !['ok', 'skipped'].includes(r.outcome))
    const maxOk = rs.filter(r => r.outcome === 'ok').pop()
    let verdict = 'linear-ish'
    if (fail) verdict = `${fail.outcome}@n=${fail.n}`
    else if (slope !== null && slope >= 1.6) verdict = 'super-linear (≈quadratic+)'
    else if (slope !== null && slope >= 1.25) verdict = 'super-linear (mild)'
    else if (!ok.length) verdict = 'too fast to measure'
    out.push({family, format, points: rs, slope, verdict, fail, maxOk})
  }
  return out
}

function report() {
  const file = args._[1]
  const rows = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l))
  const fams = analyse(rows)
  const lines = []
  lines.push(`## Sweep summary (${file})`, '', '| family | fmt | verdict | slope (last 2) | largest ok n → ms / RSS MB / out kB | first failure |', '|---|---|---|---|---|---|')
  const rank = f => (f.fail ? 0 : f.slope >= 1.6 ? 1 : f.slope >= 1.25 ? 2 : 3)
  fams.sort((a, b) => rank(a) - rank(b) || (b.slope || 0) - (a.slope || 0))
  for (const f of fams) {
    const m = f.maxOk
    lines.push(
      `| ${f.family} | ${f.format ? 'T' : 'F'} | ${f.verdict} | ${f.slope === null ? '–' : f.slope.toFixed(2)} | ${m ? `${m.n} → ${Math.round(m.ms)} / ${m.maxRssMB} / ${Math.round((m.outBytes || 0) / 1024)}` : '–'} | ${f.fail ? `${f.fail.outcome} n=${f.fail.n}: ${(f.fail.message || '').replace(/\|/g, '\\|').slice(0, 80)}` : ''} |`,
    )
  }
  lines.push('', '## Per-family tables', '')
  for (const f of fams) {
    lines.push(`### ${f.family} (format=${f.format})`, '', '| n | outcome | compile ms | wall ms | max RSS MB | heapUsed MB | out kB |', '|---|---|---|---|---|---|---|')
    for (const r of f.points) lines.push(`| ${r.n} | ${r.outcome} | ${r.ms ?? ''} | ${r.wallMs ?? ''} | ${r.maxRssMB ?? ''} | ${r.heapUsedMB ?? ''} | ${r.outBytes != null ? (r.outBytes / 1024).toFixed(1) : ''} |`)
    lines.push('')
  }
  const corpusRows = rows.filter(r => r.mode === 'corpus')
  if (corpusRows.length) {
    lines.push('## Corpus', '', '| file | schema kB | fmt | outcome | compile ms | max RSS MB | out kB | note |', '|---|---|---|---|---|---|---|---|')
    corpusRows.sort((a, b) => (b.ms || 1e9) - (a.ms || 1e9))
    for (const r of corpusRows) lines.push(`| ${r.file} | ${Math.round((r.schemaBytes || 0) / 1024)} | ${r.format ? 'T' : 'F'} | ${r.outcome} | ${r.ms ?? ''} | ${r.maxRssMB ?? ''} | ${r.outBytes != null ? Math.round(r.outBytes / 1024) : ''} | ${(r.message || '').replace(/\|/g, '\\|').slice(0, 80)} |`)
  }
  const md = lines.join('\n')
  if (args.md) fs.writeFileSync(args.md, md + '\n')
  else console.log(md)
}

function summariseProfiles(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.cpuprofile'))
  for (const f of files) {
    const r = spawnSync(process.execPath, [path.join(__dirname, 'cpuprof-summary.js'), path.join(dir, f)], {encoding: 'utf8'})
    console.log(r.stdout || r.stderr)
  }
}

;(async () => {
  switch (mode) {
    case 'families':
      for (const [k, m] of Object.entries(META)) console.log(`${k.padEnd(38)} ${m.desc}`)
      break
    case 'sweep':
      await sweep()
      break
    case 'one':
      await one()
      break
    case 'file':
      await fileMode()
      break
    case 'corpus':
      await corpus()
      break
    case 'baseline':
      await baseline()
      break
    case 'report':
      report()
      break
    default:
      console.error(`unknown mode ${mode}`)
      process.exit(2)
  }
  if (OUT) OUT.end()
})()
