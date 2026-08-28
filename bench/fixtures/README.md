# Benchmark fixtures

Real-world schemas vendored for `bench/bench.mjs`, so that the benchmark never touches the network and always compiles the same bytes. They are inputs only: nothing here ships in the npm package (`bench/` is in `.npmignore`).

| file | what | source | fetched | licence |
|---|---|---|---|---|
| `tsconfig.json` | SchemaStore's tsconfig.json schema (426 KB; `allOf` of `$ref`s, deep `compilerOptions`, many string enums) | https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/tsconfig.json | 2026-08-28 | Apache-2.0 (SchemaStore) |
| `github-workflow.json` | SchemaStore's GitHub Actions workflow schema (111 KB; `definitions` + `oneOf`/`patternProperties` heavy) | https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/github-workflow.json | 2026-08-28 | Apache-2.0 (SchemaStore) |
| `kubernetes-definitions-v1.30.0.json` | every Kubernetes v1.30.0 API object as one `definitions` block (1.1 MB, 626 definitions, no `$ref`s); compiled with `unreachableDefinitions: true`, the "generate all my models" use | https://github.com/yannh/kubernetes-json-schema/blob/master/v1.30.0-standalone/_definitions.json (generated from the Kubernetes OpenAPI spec) | 2026-08-28 | Apache-2.0 (kubernetes-json-schema, Kubernetes) |

Files are byte-for-byte as served; don't reformat them (they are not covered by `bun run format`).
