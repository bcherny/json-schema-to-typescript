# Fuzz harness

An end-to-end fuzzer for `compile()`. It generates plausible JSON Schemas, compiles
each one in a child process under a wall-clock timeout and a heap cap, and reports
what broke.

The generator is deliberately biased toward schemas a person could actually write —
bounded depth, bounded node counts, realistic keyword combinations. The goal is bugs
that show up in practice, not what happens at 10,000 levels of nesting.

## Running it

```bash
npm run build:server                       # the harness runs against dist/
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
  means the harness cannot break `npm test`.
