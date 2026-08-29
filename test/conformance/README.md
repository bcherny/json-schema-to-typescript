# Spec conformance gate

`node test/conformance/run.js` measures how faithfully generated types follow the
JSON Schema specification, group by group over the official
[JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite),
and compares the result with [baseline.json](baseline.json). The `output` job in
[ci.yml](../../.github/workflows/ci.yml) runs it on every push and pull request and
`ci-ok` requires it.

```sh
bun run build:server                          # the runner loads dist/
node test/conformance/run.js                  # ~10 s; exit 1 and a list of what moved if anything differs from the baseline
node test/conformance/run.js --update         # re-record baseline.json
node test/conformance/run.js --filter draft7/ref.json --report /tmp/rows.json   # a few groups, every detail
```

The first run fetches the suite at the pinned commit (`SUITE_COMMIT` in run.js) into
node_modules/.cache/; `--suite <dir>` uses an existing checkout instead.

## What is measured

A suite *group* is one schema plus instances marked valid or invalid. For each
group the runner

1. compiles the schema (`format: false`, root type forced to be called `Root`,
   remote `$ref`s to `http://localhost:1234/` answered from the suite's `remotes/`
   directory, every other URL refused);
2. type-checks the output with the TypeScript compiler, `strict`, `lib.es5` only;
3. writes every instance as `export const vN: Root = <the instance as a literal>`
   and records which ones the compiler rejects.

That gives each group one line in the baseline: `"crash"` if step 1 threw,
`"invalid-output"` if step 2 produced a diagnostic (or no `Root` at all), otherwise
four numbers — **valid instances rejected**, valid instances, **invalid instances
accepted**, invalid instances. The two bold ones are the score; lower is better.
They are counts, not lists: a change that fixes one instance of a group and breaks
another of the same kind leaves the line unchanged, and only `--report` shows it.

Neither will ever be zero everywhere, and that is fine: TypeScript cannot say
"string matching this pattern", "number below 5" or "array with unique items", so
instances invalid for those reasons are accepted by any type we could emit, and the
generator deliberately reads `properties` without `type` as "this is an object",
which rejects the strings and numbers the specification says such a schema also
allows. The baseline is not a claim that the numbers are right; it is a record of
what master does, so that a pull request shows what it changes.

On top of the suite's own 1 400 groups the runner adds 1 000 *recombinations* of
them ([mutate.js](mutate.js), fixed seed): a suite schema wrapped in `properties`,
`items`, `additionalProperties`, a `$ref`, a single-member `allOf`, or paired with
another under `anyOf`/`allOf`/two properties, carrying along every instance whose
verdict against the new schema follows from its verdict against the old one. The
suite tests one keyword at a time at the root; these catch the keyword that is
handled at the root but not one level down.

Groups whose schema is a bare `true`/`false`, or that depend on `$id`-relative,
`$anchor`, URN or metaschema references the resolver does not implement, show as
`"crash"`; that is expected and is why the crash count is not zero.

## When the job fails

The log lists every group that moved, worst first, with the instance and the
compiler message:

```
FAIL: 1 group(s) regressed against the baseline:

draft7/properties.json#0 (object properties validation)
    was: rejects 2/4 valid, accepts 0/2 invalid
    now: rejects 3/4 valid, accepts 0/2 invalid
    rejects {"foo":1,"bar":"baz"}: TS2322: Type 'number' is not assignable to type 'string'.
```

- **A group regressed** (more valid instances rejected, more invalid ones accepted,
  or it stopped compiling / type-checking): the change broke something the fixtures
  in test/e2e do not cover. `node test/conformance/run.js --filter <group id> --report rows.json`
  lists each offending instance with the compiler's message (the schema itself is in
  the suite file the id names; `compile()` it to read the output); fix the generator.
- **Groups improved** and nothing regressed: the change fixed something. The job
  still fails, because the baseline has to keep describing master — run
  `node test/conformance/run.js --update`, look at the diff of baseline.json (it is
  one group per line, so the diff is exactly the groups that moved), and commit it
  as part of the change. Treat it like a snapshot: a reviewer should be able to read
  from the diff which spec behaviours the pull request changes.
- **Both**: decide whether the regressions are the price of the improvement; if they
  are, say so in the pull request and update the baseline, otherwise fix them first.
- **"recorded for another suite commit or mutation seed"**: someone changed
  `SUITE_COMMIT`, `MUTATION_SEED` or `MUTATION_COUNT` in run.js without re-recording;
  run `--update` and commit the result together with that change.

The run is deterministic (fixed suite commit, fixed seed, no network after the
fetch, no timing in the results), so a difference is never noise. It runs on Linux
only in CI simply because nothing in it depends on the platform.
