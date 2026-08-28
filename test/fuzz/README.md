# Fuzz harness

An end-to-end fuzzer for `compile()`. It generates plausible JSON Schemas, compiles
each one in a child process under a wall-clock timeout and a heap cap, and reports
what broke.

The generator is deliberately biased toward schemas a person could actually write —
bounded depth, bounded node counts, realistic keyword combinations. The goal is bugs
that show up in practice, not what happens at 10,000 levels of nesting.

## Running it

```bash
bun run build:server                       # the harness runs against dist/
node test/fuzz/fuzz.js --seeds 300 --out findings.json
```

Useful flags:

| Flag | Meaning |
| --- | --- |
| `--seeds N` | how many cases to generate (default 300) |
| `--start N` | first seed, so runs can cover different ranges (default 1) |
| `--timeout MS` | per-case wall clock before a case counts as a hang (default 20000) |
| `--memory MB` | per-case heap cap (default 512) |
| `--seed N` | re-run a single seed and dump its schema, options, and result |
| `--no-shrink` | skip minimization (much faster, much noisier) |
| `--out FILE` | write the JSON report here instead of stdout |

Every case is derived from its seed, so `--seed 27` reproduces case 27 exactly.

## In CI

`bun run fuzz:ci` is the smoke version: the `fuzz` job in `.github/workflows/ci.yml`
runs it on every push and pull request, and `ci-ok` (the required check) fails when
it does. It is `test/fuzz/ci.js` — seeds 1..500, no shrinking, four `fuzz.js` chunks
at a time, one merged report in `fuzz-report.json` (uploaded as the run's
`fuzz-report` artifact), and a non-zero exit for any finding that
`test/fuzz/known-findings.json` does not cover. About 75 seconds on a 4-core machine.

`known-findings.json` lists what this range still produces on master, each entry
naming the open issue or PR that tracks it and the seeds it fires on. An entry
matches a finding on status, error name, the file of its top library frame and a
message prefix — not line and column, so unrelated edits to that file do not break
it — and covers only the seeds it lists: the same error from any other seed is a
regression wearing a known bug's message, and fails the job. When a fix lands,
delete its entry; the run prints a note once an entry or some of its seeds stop
reproducing. When the job goes red the log names the seeds: `node
test/fuzz/fuzz.js --seed N` prints that case's schema, options and result, and
`node test/fuzz/fuzz.js --start N --seeds 1` minimizes it.

What keeps the gate from flapping: the seed list is fixed, so every run compiles the
same schemas; the per-case timeout in CI is 60 s where a case normally finishes in
well under one, so only a real hang gets near it; and each seed behind a `TIMEOUT`,
`OOM` or `CRASHED` finding is re-run on its own and kept only if it fails again. A
hang or heap blow-up that does repeat is exactly what the job exists to catch, so
those classes are not exempt.

| `ci.js` flag | Meaning |
| --- | --- |
| `--start N`, `--seeds N` | the range (the `fuzz:ci` script pins 1 and 500) |
| `--jobs N` | chunks in parallel (default: cores, at most 4) |
| `--timeout MS`, `--memory MB` | per-case budgets passed to `fuzz.js` (default 60000 and 512) |
| `--known FILE` | the allowlist (default `test/fuzz/known-findings.json`; a missing file means none) |
| `--out FILE` | the merged report (default `fuzz-report.json`) |

## What it classifies

| Status | Meaning |
| --- | --- |
| `TIMEOUT` | compile did not finish in time — excessive CPU |
| `OOM` | the child exhausted its heap cap |
| `STACK_OVERFLOW` | unbounded recursion |
| `THREW` | an unexpected exception (`ValidationError` is expected, and ignored) |
| `INVALID_TS` | compile succeeded but emitted TypeScript that does not parse |

`INVALID_TS` matters because nothing throws in that case: the compiler reports
success and hands back code that breaks the consumer's build. The check parses the
output with the TypeScript compiler and reports syntactic diagnostics.

## Shrinking

A raw fuzz case is too noisy to act on, so each distinct finding is minimized before
it is reported: options are dropped one at a time, then subtrees are deleted,
replaced with `{type: 'string'}`, or emptied — keeping any reduction that preserves
the failure signature. Findings are deduped by signature first, so a bug that fires
on 50 seeds is shrunk once.

## Notes

- External `$ref` resolution is disabled for every generated case (`resolve: {file:
  false, http: false}`). A fuzzed schema must never reach the network or the
  filesystem.
- These files are `.js` on purpose. The repository's `.gitignore` excludes `*.js`,
  so they were added with `git add -f`; keeping them out of the TypeScript build
  means the harness cannot break `bun run test`.
