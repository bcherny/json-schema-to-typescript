#!/usr/bin/env node
/**
 * CI gate around the fuzz harness (fuzz.js): a fixed seed range, no shrinking, a
 * few fuzz.js chunks at a time, one merged report, and a non-zero exit for any
 * finding that known-findings.json does not list -- a case slower than --slow
 * included. `bun run fuzz:ci` runs it after `bun run build:server`;
 * test/fuzz/README.md ("In CI") says how the allowlist matches and what keeps the
 * gate from flapping.
 *
 * Usage:
 *   node test/fuzz/ci.js --start 1 --seeds 500 --out fuzz-report.json
 *   [--jobs N] [--timeout MS] [--memory MB] [--slow MS] [--known FILE]
 */

const {spawn} = require('child_process')
const {readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync} = require('fs')
const minimist = require('minimist')
const {availableParallelism, tmpdir} = require('os')
const {join, resolve} = require('path')

const FUZZ = resolve(__dirname, 'fuzz.js')
const CHUNK = 20 // seeds per fuzz.js invocation; small enough to balance the workers
const CONFIRM = ['TIMEOUT', 'OOM', 'CRASHED', 'SLOW'] // machine-dependent outcomes: count only if they repeat

function parseArgs(argv) {
  const defaults = {
    start: 1,
    seeds: 500,
    jobs: Math.min(4, availableParallelism()),
    timeout: 60000,
    memory: 512,
    // A case takes well under a second, node start-up included; one that finishes but
    // needs twenty times that is a regression the 60 s timeout would never mention.
    slow: 10000,
    known: resolve(__dirname, 'known-findings.json'),
    out: 'fuzz-report.json',
  }
  const args = minimist(argv.slice(2), {default: defaults, string: ['known', 'out']})
  const unknown = Object.keys(args)
    .filter(k => k !== '_' && !(k in defaults))
    .concat(args._)
  if (unknown.length) throw new Error(`unknown arguments: ${unknown.join(' ')}`)
  return args
}

/** Run fuzz.js over [start, start+seeds) and resolve with its parsed report. */
function runChunk(start, seeds, args, workDir) {
  const out = join(workDir, `report-${start}-${seeds}.json`)
  const argv = [
    '--start',
    start,
    '--seeds',
    seeds,
    '--timeout',
    args.timeout,
    '--memory',
    args.memory,
    '--slow',
    args.slow,
    '--out',
    out,
  ]
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [FUZZ, '--no-shrink', '--quiet', ...argv.map(String)], {
      stdio: ['ignore', 'inherit', 'inherit'],
    })
    child.on('error', reject)
    child.on('exit', code => {
      if (code !== 0 || !existsSync(out)) {
        return reject(new Error(`fuzz.js exited ${code} for seeds ${start}..${start + seeds - 1}`))
      }
      resolvePromise(JSON.parse(readFileSync(out, 'utf-8')))
    })
  })
}

/** The whole range in CHUNK-sized pieces, `jobs` at a time; reports come back in seed order. */
async function runRange(args, workDir) {
  const chunks = []
  for (let s = args.start; s < args.start + args.seeds; s += CHUNK) {
    chunks.push({start: s, seeds: Math.min(CHUNK, args.start + args.seeds - s)})
  }
  const reports = new Array(chunks.length)
  let next = 0
  async function worker() {
    while (next < chunks.length) {
      const i = next++
      reports[i] = await runChunk(chunks[i].start, chunks[i].seeds, args, workDir)
    }
  }
  await Promise.all(Array.from({length: Math.min(args.jobs, chunks.length)}, worker))
  return reports
}

/** Merge reports given in seed order: sum the cases, keep the slowest, dedupe findings by signature, union their seeds. */
function merge(reports) {
  let casesRun = 0
  let slowest = null
  const bySignature = new Map()
  for (const report of reports) {
    casesRun += report.casesRun
    if (report.slowest && (!slowest || report.slowest.elapsedMs > slowest.elapsedMs)) slowest = report.slowest
    for (const f of report.findings) {
      const seen = bySignature.get(f.signature)
      if (seen) seen.seeds.push(...f.seeds)
      else bySignature.set(f.signature, {...f, seeds: [...f.seeds]})
    }
  }
  const findings = [...bySignature.values()].sort((a, b) => a.seed - b.seed)
  for (const f of findings) f.occurrences = f.seeds.length
  return {casesRun, slowest, findings}
}

/**
 * A finding is known when an allowlist entry has its status, error name, the
 * file of its top library frame and the start of its message -- and lists every
 * seed it fired on. Line and column are left out on purpose: an unrelated edit
 * to the same file moves them, and that must not turn CI red. The seed list is
 * what keeps an entry narrow: the same error from a seed that compiles fine on
 * master is a regression wearing a known bug's message, and counts as new.
 */
function matches(finding, entry) {
  return (
    finding.status === entry.status &&
    (entry.errorName === undefined || finding.errorName === entry.errorName) &&
    (entry.frame === undefined || frameFile(finding.frame) === entry.frame) &&
    String(finding.message || '').startsWith(entry.message || '')
  )
}

function frameFile(frame) {
  return String(frame || '').replace(/:\d+:\d+$/, '')
}

function list(seeds) {
  return seeds.length > 12 ? `${seeds.slice(0, 12).join(',')},… (${seeds.length})` : seeds.join(',')
}

function loadKnown(path) {
  if (!existsSync(path)) return []
  const entries = JSON.parse(readFileSync(path, 'utf-8')).findings || []
  for (const entry of entries) {
    if (!entry.issue || !entry.status || !Array.isArray(entry.seeds)) {
      throw new Error(
        `${path}: every entry needs the issue or PR number that tracks it, a status and the seeds it fires on: ${JSON.stringify(entry)}`,
      )
    }
  }
  return entries
}

async function main() {
  const args = parseArgs(process.argv)
  const known = loadKnown(args.known)
  const workDir = mkdtempSync(join(tmpdir(), 'jstt-fuzz-ci-'))
  const started = Date.now()
  const last = args.start + args.seeds - 1

  console.log(
    `fuzz smoke: seeds ${args.start}..${last}, ${args.jobs} at a time (per case: timeout ${args.timeout}ms, heap ${args.memory}MB, slow above ${args.slow}ms)`,
  )
  const merged = merge(await runRange(args, workDir))

  // Machine-dependent outcomes are re-run seed by seed, alone, and keep only the
  // seeds that fail again. Per seed, not per finding: TIMEOUT and OOM signatures
  // carry no detail, so one finding can hold a hiccup on one seed and a real hang
  // on another.
  const findings = []
  for (const f of merged.findings) {
    if (CONFIRM.includes(f.status)) {
      const repeated = []
      for (const seed of f.seeds) {
        // Any of these outcomes again counts, not only the same one: they are budgets
        // on one run, so a SLOW seed that times out alone (or the reverse) repeated.
        const again = (await runChunk(seed, 1, args, workDir)).findings.find(g => CONFIRM.includes(g.status))
        // Say so right away either way: each confirmation can cost a full per-case
        // timeout, and if enough seeds hang for the job's own time limit to kill it,
        // the log must already name them.
        if (again) {
          repeated.push(seed)
          console.log(`  seed ${seed}: ${again.status} on a re-run alone; counted`)
        } else console.log(`  seed ${seed}: ${f.status} did not repeat on a re-run alone; not counted`)
      }
      if (!repeated.length) continue
      Object.assign(f, {seed: repeated[0], seeds: repeated, occurrences: repeated.length})
    }
    findings.push(f)
  }

  for (const f of findings) {
    const entry = known.find(e => matches(f, e))
    const unlisted = entry ? f.seeds.filter(seed => !entry.seeds.includes(seed)) : f.seeds
    f.known = entry && !unlisted.length ? `#${entry.issue}` : null
    f.note =
      entry && unlisted.length ? `the error #${entry.issue} has, on seeds not listed for it: ${list(unlisted)}` : null
  }
  const fresh = findings.filter(f => !f.known)

  // Allowlist upkeep: say when an entry, or some of its seeds, stopped reproducing.
  const notes = []
  for (const e of known) {
    const listed = e.seeds.filter(seed => seed >= args.start && seed <= last)
    const fired = findings.filter(f => matches(f, e)).flatMap(f => f.seeds)
    const stale = listed.filter(seed => !fired.includes(seed))
    if (!stale.length) continue
    notes.push(
      stale.length === listed.length && !fired.length
        ? `entry for #${e.issue} matched nothing; if its fix has landed, delete it`
        : `entry for #${e.issue}: seeds ${list(stale)} no longer reproduce it; trim them`,
    )
  }
  const wallMs = Date.now() - started

  const report = {
    ranAt: new Date().toISOString(),
    seedRange: [args.start, last],
    casesRun: merged.casesRun,
    wallMs,
    slowest: merged.slowest,
    newFindings: fresh.length,
    findings,
    notes,
  }
  writeFileSync(args.out, JSON.stringify(report, null, 2))

  console.log(
    `\nran ${merged.casesRun} cases in ${(wallMs / 1000).toFixed(1)}s: ${findings.length} distinct findings, ${fresh.length} new`,
  )
  if (merged.slowest) console.log(`slowest case: seed ${merged.slowest.seed}, ${merged.slowest.elapsedMs}ms`)
  for (const f of findings) {
    const tag = f.known ? `known ${f.known}` : 'NEW'
    const message = String(f.message).split('\n')[0].slice(0, 100)
    console.log(`  [${tag}] seeds ${list(f.seeds)}  ${f.status} ${f.errorName} ${frameFile(f.frame)}  ${message}`)
    if (f.note) console.log(`        ${f.note}`)
  }
  // A stale entry would quietly re-allow its bug on those seeds if it ever came
  // back, so make the note hard to miss: a workflow annotation on the run's summary.
  for (const note of notes)
    console.log(`${process.env.GITHUB_ACTIONS ? '::warning::' : '  note: '}known-findings ${note}`)
  console.log(`report: ${args.out}`)

  try {
    rmSync(workDir, {recursive: true, force: true})
  } catch {
    /* best effort */
  }

  if (merged.casesRun !== args.seeds) {
    console.error(`\nFAIL: expected ${args.seeds} cases, ran ${merged.casesRun} — the harness itself is broken`)
    process.exit(2)
  }
  if (fresh.length) {
    console.error(
      `\nFAIL: ${fresh.length} finding(s) not in ${args.known}. Reproduce one with: node test/fuzz/fuzz.js --seed <seed>`,
    )
    process.exit(1)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(2)
})
