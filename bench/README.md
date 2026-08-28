# bench/ — how long `compile()` takes, and how much memory it needs

A fixed set of large real-world schemas, compiled repeatedly, so that a change to the compiler can be stated as "X ms → Y ms, peak heap A → B MB" and re-checked by anyone.

```sh
bun run build:server                 # the benchmark loads dist/, ie. what users run
node bench/bench.mjs                 # everything, format off and on, 5 timed runs each (several minutes)
bun bench/bench.mjs                  # same under bun
node bench/bench.mjs --format false --runs 3 --only fhir,k8s
node bench/bench.mjs --json before.json          # keep the raw numbers
node bench/bench.mjs --profile cpu --only azure  # V8 .cpuprofile per case in bench/profiles/ (node only; `heap` for .heapprofile)
bun bench/bench.mjs --src            # load src/ directly instead of dist/ (bun only; skips the build step while iterating)
```

## What it measures

Every schema × `format` setting runs in a fresh child process (`node --expose-gc`, or `bun`): one untimed warm-up `compile()`, then N timed ones. Per case it prints

| column | meaning |
|---|---|
| median ms / min ms | wall-clock of one `compile()` call (`performance.now()`), median and minimum of the timed runs |
| peak heap MB | the largest V8 heap seen right after a run (`v8.getHeapStatistics().total_heap_size`: what the engine had to commit for that compile; it shrinks lazily, so this tracks the high-water mark) |
| max RSS MB | the kernel's peak resident set size for the whole child process (`process.resourceUsage().maxRSS`), runtime and loaded modules included |
| output md5 | first 8 hex digits of the generated TypeScript's md5: must not change across a performance-only change |

and a TOTAL row (sum of medians, max of the memory columns). `format: false` is the compiler proper; `format: true` (the default) adds prettier, which for large outputs is most of the time, so the two are reported separately. `--json` writes every run's numbers plus the machine, runtime and git SHA.

Timings move by 5–10 % between runs on a quiet machine and by much more on a busy one: compare before/after on the same machine, back to back, and don't run two benchmarks at once.

## The set

| case | from | why |
|---|---|---|
| fhir | test/e2e/realWorld.fhir.ts | 2.7 MB schema, 680 definitions, 6 MB of output |
| azure | test/e2e/realWorld.azureDeploymentTemplate.ts | ~60 remote `$ref`s (answered from test/__fixtures__), 8 MB of output: the slowest fixture in the suite |
| payloadCMS | test/e2e/realWorld.payloadCMS.ts | `unreachableDefinitions`, deep anonymous unions |
| heroku | test/e2e/realWorld.heroku.ts | Heroku platform API, `$ref`-heavy |
| openapi, awsQuicksight | test/e2e/realWorld.*.ts | small; keep the fixed per-compile overhead visible |
| k8s | bench/fixtures/kubernetes-definitions-v1.30.0.json | 626 Kubernetes definitions with `unreachableDefinitions: true` |
| tsconfig | bench/fixtures/tsconfig.json | SchemaStore's most-installed schema; `allOf` of `$ref`s, many enums |
| githubWorkflow | bench/fixtures/github-workflow.json | `oneOf`/`patternProperties` heavy |

Sources and licences of the vendored files: [fixtures/README.md](fixtures/README.md). To add a case, put the schema under `fixtures/` (or point at a test/e2e module) and add a line to `CASES` at the top of `bench.mjs`.
