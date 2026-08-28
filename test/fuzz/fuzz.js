#!/usr/bin/env node
/**
 * End-to-end fuzzer for json-schema-to-typescript.
 *
 * Generates plausible JSON Schemas, compiles each one in a child process with a
 * wall-clock timeout and a heap cap, and classifies the failures that come back:
 *
 *   TIMEOUT         compile did not finish in time — excessive CPU
 *   OOM             child exhausted the heap cap
 *   STACK_OVERFLOW  unbounded recursion
 *   THREW           an unexpected exception (ValidationError is expected, not a bug)
 *   INVALID_TS      compile succeeded but emitted syntactically invalid TypeScript
 *
 * Findings are deduped by signature and then shrunk to a minimal reproducing
 * schema, because an unshrunk fuzz case is not something a maintainer can act on.
 *
 * Usage:
 *   node test/fuzz/fuzz.js --seeds 500 --out findings.json
 *   node test/fuzz/fuzz.js --seed 12345          # re-run one case
 */

const {spawnSync} = require('child_process')
const {writeFileSync, mkdtempSync, rmSync} = require('fs')
const {tmpdir} = require('os')
const {join, resolve} = require('path')
const {generateSchema, generateOptions} = require('./schemaGen')

const RUN_CASE = resolve(__dirname, 'runCase.js')

// Errors the library raises on purpose. Not bugs.
const EXPECTED_ERRORS = ['ValidationError']

function parseArgs(argv) {
  const args = {seeds: 300, start: 1, timeout: 20000, memory: 512, out: null, seed: null, shrink: true, quiet: false}
  for (let i = 2; i < argv.length; i++) {
    const [k, v] = argv[i].includes('=') ? argv[i].split('=') : [argv[i], argv[i + 1]]
    switch (k) {
      case '--seeds':
        args.seeds = Number(v)
        if (!argv[i].includes('=')) i++
        break
      case '--start':
        args.start = Number(v)
        if (!argv[i].includes('=')) i++
        break
      case '--timeout':
        args.timeout = Number(v)
        if (!argv[i].includes('=')) i++
        break
      case '--memory':
        args.memory = Number(v)
        if (!argv[i].includes('=')) i++
        break
      case '--out':
        args.out = v
        if (!argv[i].includes('=')) i++
        break
      case '--seed':
        args.seed = Number(v)
        if (!argv[i].includes('=')) i++
        break
      case '--no-shrink':
        args.shrink = false
        break
      case '--quiet':
        args.quiet = true
        break
    }
  }
  return args
}

const workDir = mkdtempSync(join(tmpdir(), 'jstt-fuzz-'))
let caseCounter = 0

/** Run one (schema, options) pair in a child process and classify the outcome. */
function runCase(schema, options, {timeout, memory}) {
  const casePath = join(workDir, `case-${caseCounter++}.json`)
  writeFileSync(casePath, JSON.stringify({schema, options}))

  const started = Date.now()
  const child = spawnSync(process.execPath, [`--max-old-space-size=${memory}`, RUN_CASE, casePath], {
    timeout,
    encoding: 'utf-8',
    maxBuffer: 32 * 1024 * 1024,
    killSignal: 'SIGKILL',
  })
  const elapsed = Date.now() - started

  if (child.error && child.error.code === 'ETIMEDOUT') {
    return {status: 'TIMEOUT', errorName: 'Timeout', message: `exceeded ${timeout}ms`, frame: '', elapsed}
  }

  const stderr = child.stderr || ''
  if (/JavaScript heap out of memory|Allocation failed|FATAL ERROR: .*heap/i.test(stderr)) {
    return {status: 'OOM', errorName: 'OutOfMemory', message: `exceeded ${memory}MB heap`, frame: '', elapsed}
  }

  const marker = (child.stdout || '').split('\n').find(l => l.startsWith('__FUZZ_RESULT__'))
  if (!marker) {
    if (/Maximum call stack size exceeded/.test(stderr)) {
      return {status: 'STACK_OVERFLOW', errorName: 'RangeError', message: 'Maximum call stack size exceeded', frame: '', elapsed}
    }
    return {
      status: 'CRASHED',
      errorName: 'ProcessCrash',
      message: `exit ${child.status} signal ${child.signal}: ${stderr.slice(0, 300)}`,
      frame: '',
      elapsed,
    }
  }

  const result = JSON.parse(marker.slice('__FUZZ_RESULT__'.length).trim())
  result.elapsed = elapsed

  if (result.status === 'THREW' && /Maximum call stack size exceeded/.test(result.message)) {
    result.status = 'STACK_OVERFLOW'
  }
  return result
}

function isInteresting(result) {
  if (result.status === 'OK') return false
  if (result.status === 'HARNESS_ERROR') return false
  if (result.status === 'THREW' && EXPECTED_ERRORS.includes(result.errorName)) return false
  return true
}

function signature(result) {
  if (result.status === 'TIMEOUT' || result.status === 'OOM') return result.status
  if (result.status === 'INVALID_TS') {
    // Group by the diagnostic itself, minus the quoted source text.
    return `INVALID_TS:${result.message.split('(line')[0].trim()}`
  }
  return `${result.status}:${result.errorName}:${result.frame}:${result.message.slice(0, 60)}`
}

// ---------------------------------------------------------------------------
// Shrinking
// ---------------------------------------------------------------------------

const clone = x => JSON.parse(JSON.stringify(x))

/** Every path in the schema tree, deepest first (deep edits shrink faster). */
function collectPaths(node, path = [], out = []) {
  if (node === null || typeof node !== 'object') return out
  for (const key of Object.keys(node)) {
    const child = node[key]
    collectPaths(child, path.concat(key), out)
    out.push(path.concat(key))
  }
  return out
}

function getAt(obj, path) {
  return path.reduce((o, k) => (o == null ? o : o[k]), obj)
}

function setAt(obj, path, value) {
  const parent = getAt(obj, path.slice(0, -1))
  if (parent == null) return false
  parent[path[path.length - 1]] = value
  return true
}

function deleteAt(obj, path) {
  const parent = getAt(obj, path.slice(0, -1))
  if (parent == null) return false
  const key = path[path.length - 1]
  if (Array.isArray(parent)) {
    const i = Number(key)
    if (Number.isNaN(i)) return false
    parent.splice(i, 1)
  } else {
    delete parent[key]
  }
  return true
}

/** Candidate reductions, cheapest and most aggressive first. */
function* candidates(schema, options) {
  // Drop options one at a time — a bug that needs fewer flags is a better report.
  for (const key of Object.keys(options)) {
    if (key === '$refOptions') continue
    const o = clone(options)
    delete o[key]
    yield {schema, options: o}
  }

  const paths = collectPaths(schema)
  for (const path of paths) {
    const key = path[path.length - 1]
    if (key === '$schema') continue

    const deleted = clone(schema)
    if (deleteAt(deleted, path)) yield {schema: deleted, options}

    const node = getAt(schema, path)
    if (node !== null && typeof node === 'object') {
      const simplified = clone(schema)
      if (setAt(simplified, path, {type: 'string'})) yield {schema: simplified, options}
      const emptied = clone(schema)
      if (setAt(emptied, path, {})) yield {schema: emptied, options}
    }
    if (typeof node === 'number' && node > 0) {
      for (const smaller of [0, 1, Math.floor(node / 2)]) {
        if (smaller >= node) continue
        const reduced = clone(schema)
        if (setAt(reduced, path, smaller)) yield {schema: reduced, options}
      }
    }
    if (typeof node === 'string' && node.length > 8) {
      const shortened = clone(schema)
      if (setAt(shortened, path, 'x')) yield {schema: shortened, options}
    }
  }
}

/**
 * Greedily reduce the case while the failure signature holds. Bounded by a step
 * budget so a slow signature (a timeout, say) cannot run forever.
 */
function shrink(schema, options, targetSig, runOpts, budget) {
  let best = {schema: clone(schema), options: clone(options)}
  let steps = 0
  let improved = true

  while (improved && steps < budget) {
    improved = false
    for (const candidate of candidates(best.schema, best.options)) {
      if (steps++ >= budget) break
      let result
      try {
        result = runCase(candidate.schema, candidate.options, runOpts)
      } catch {
        continue
      }
      if (isInteresting(result) && signature(result) === targetSig) {
        best = {schema: clone(candidate.schema), options: clone(candidate.options)}
        improved = true
        break
      }
    }
  }
  return {...best, shrinkSteps: steps}
}

// ---------------------------------------------------------------------------
// Severity — keeps the report focused on things that bite real users
// ---------------------------------------------------------------------------

function severity(finding) {
  const size = JSON.stringify(finding.schema).length
  switch (finding.status) {
    case 'OOM':
    case 'TIMEOUT':
      // A small schema that burns the CPU or the heap is the worst case: it looks
      // ordinary and hangs a build. A huge one is far less likely in practice.
      return size < 400 ? 'high' : 'medium'
    case 'INVALID_TS':
      return 'high' // emitted code does not compile — breaks the consumer's build
    case 'STACK_OVERFLOW':
    case 'CRASHED':
      return 'high'
    case 'THREW':
      return ['TypeError', 'RangeError', 'ReferenceError'].includes(finding.errorName) ? 'high' : 'medium'
    default:
      return 'low'
  }
}

// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv)
  const runOpts = {timeout: args.timeout, memory: args.memory}
  const log = (...a) => !args.quiet && console.log(...a)

  if (args.seed !== null) {
    const schema = generateSchema(args.seed)
    const options = generateOptions(args.seed)
    console.log(JSON.stringify({seed: args.seed, schema, options}, null, 2))
    console.log(JSON.stringify(runCase(schema, options, runOpts), null, 2))
    return
  }

  const findings = new Map()
  let ran = 0

  log(`fuzzing seeds ${args.start}..${args.start + args.seeds - 1} (timeout ${args.timeout}ms, heap ${args.memory}MB)`)

  for (let i = 0; i < args.seeds; i++) {
    const seed = args.start + i
    const schema = generateSchema(seed)
    const options = generateOptions(seed)
    let result
    try {
      result = runCase(schema, options, runOpts)
    } catch (e) {
      continue
    }
    ran++

    if (!isInteresting(result)) continue
    const sig = signature(result)
    if (findings.has(sig)) {
      findings.get(sig).seeds.push(seed)
      continue
    }

    log(`  [seed ${seed}] ${result.status} ${result.errorName} ${result.message.slice(0, 80)}`)
    findings.set(sig, {signature: sig, seed, seeds: [seed], ...result, schema, options})
  }

  log(`\nran ${ran} cases, ${findings.size} distinct findings`)

  const out = []
  for (const finding of findings.values()) {
    let minimized = {schema: finding.schema, options: finding.options, shrinkSteps: 0}
    if (args.shrink) {
      // Timeout signatures cost a full timeout per probe, so give them less rope.
      const budget = finding.status === 'TIMEOUT' || finding.status === 'OOM' ? 60 : 400
      log(`shrinking ${finding.signature.slice(0, 70)} (budget ${budget})...`)
      minimized = shrink(finding.schema, finding.options, finding.signature, runOpts, budget)
    }
    const entry = {
      signature: finding.signature,
      status: finding.status,
      errorName: finding.errorName,
      message: finding.message,
      frame: finding.frame,
      seed: finding.seed,
      occurrences: finding.seeds.length,
      seeds: finding.seeds,
      elapsedMs: finding.elapsed,
      schema: minimized.schema,
      options: minimized.options,
      shrinkSteps: minimized.shrinkSteps,
    }
    entry.severity = severity(entry)
    out.push(entry)
  }

  out.sort((a, b) => (a.severity === b.severity ? b.occurrences - a.occurrences : a.severity === 'high' ? -1 : 1))

  const report = {
    ranAt: new Date().toISOString(),
    seedRange: [args.start, args.start + args.seeds - 1],
    casesRun: ran,
    findings: out,
  }

  if (args.out) {
    writeFileSync(args.out, JSON.stringify(report, null, 2))
    log(`wrote ${args.out}`)
  } else {
    console.log(JSON.stringify(report, null, 2))
  }

  try {
    rmSync(workDir, {recursive: true, force: true})
  } catch {
    /* best effort */
  }
}

main()
