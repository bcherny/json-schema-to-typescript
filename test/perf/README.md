# Perf fuzz harness

Measures how `compile()` time and memory scale with schema size, one common schema
*shape* at a time. Sibling of `test/fuzz` (which hunts crashes on small random schemas):
here every family is a realistic shape with a single size knob `n`, each compile runs in
its own `node --max-old-space-size=<heap>` child under a wall-clock budget, and the
report fits a log-log slope per family so super-linear behaviour stands out.

```bash
npm run build:server                                   # the harness runs against dist/
node test/perf/perf-fuzz.js families                   # list the shape families
node test/perf/perf-fuzz.js sweep --out sweep.jsonl    # all families × n=25…3200 × format off/on (~30 min)
node test/perf/perf-fuzz.js report sweep.jsonl         # verdict table + per-family n-vs-time/RSS tables
node test/perf/perf-fuzz.js one --family manyDefinitionsEachUsed --n 3200 --profile /tmp/prof   # one case under --cpu-prof, summarised
node test/perf/perf-fuzz.js file some-schema.json      # any schema (options from some-schema.options.json if present)
node test/perf/perf-fuzz.js corpus dir/                # every *.json in a directory, warm http cache first (--warm false to skip)
node test/perf/perf-fuzz.js baseline                   # spawn/require/trivial-compile overhead; put it in the same --out so report can subtract it
node test/perf/perf-fuzz.js report sweep.jsonl --md sweep.md
node test/perf/gen.js oneOfRefs 3                      # print one generated schema
```

| flag | default | |
|---|---|---|
| `--ns` | 25,50,100,200,400,800,1600,3200 | size ladder; a family stops at its first failure |
| `--budget` | 10000 (corpus: 60000) | ms per compile before the child is killed (`timeout`) |
| `--heap` | 512 (corpus: 1024) | MB, `--max-old-space-size` (`oom`) |
| `--format` | both | `true` / `false` / `both` — prettier on/off |
| `--seed` | 1 | everything is deterministic from (family, n, seed) |
| `--jobs` | 1 | parallel children (timings get noisier above cores/2) |
| `--jstt` | this repo | measure another checkout's `dist/` |
| `--keep dir` | tmp | keep generated cases (`<family>-n<N>-s<seed>/schema.json` + external-ref files) |
| `--emit file` | – | (`one`/`file`) write the generated .d.ts, for output-identity checks between checkouts |
| `--options '{json}'` | – | (`file`) compile options; otherwise `<schema>.options.json` next to the file is used (`cwd` may be a URL) |
| `--profile dir` | – | (`one`/`file`) `node --cpu-prof` into dir, then summarise |
| `--out f.jsonl` | – | append one JSON row per compile |
| `--http-cache dir` | – | (`file`/`corpus`) serve remote `$ref`s from disk; same file naming as `test/__fixtures__`, so copying that directory in seeds it |

Outcomes: `ok`, `throw`, `stack` (RangeError), `timeout`, `overbudget` (finished, but past the budget), `oom`, `crash`, `skipped` (a smaller n already failed), `generror` (the generator itself hit a limit).
`ms` is `compile()` alone (hrtime inside the child); `wallMs` adds spawn + require
(≈120 ms); `report` subtracts the `baseline` row if the results file has one.

`cpuprof-summary.js <file.cpuprofile> [--top N] [--all]` prints self/inclusive time by
function with `dist/src/<file>.js:<line>`; `--all` includes native frames (RegExp, GC).

These files are `.js` and were added with `git add -f` (the repo ignores `*.js`), like `test/fuzz`.
