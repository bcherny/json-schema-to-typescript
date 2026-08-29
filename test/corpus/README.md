# Real-world corpus

`node test/corpus/run.js` compiles a set of real, widely used JSON Schemas under a
few option sets and runs the TypeScript compiler (`strict`) over every result. It
fails if any schema stops compiling or any output draws a diagnostic. The `output`
job in [ci.yml](../../.github/workflows/ci.yml) runs it (with `--e2e`) on every push
and pull request, and `ci-ok` requires it, so a change that makes generated code
invalid for some construct that only big schemas use — a duplicate declaration, a
reference to a type that was never emitted, an enum member TypeScript rejects —
turns CI red even when every fixture in test/e2e still matches its snapshot.

```sh
bun run build:server                      # the runner loads dist/, like a user would
node test/corpus/run.js                   # the vendored schemas: ~10 s
node test/corpus/run.js --e2e             # plus test/e2e/realWorld.* under the extra option sets: ~30 s
node test/corpus/run.js --only github-rest-api --variant style --out /tmp/corpus   # one case, output written to disk
```

## What it compiles

[sources.json](sources.json) is the list: each entry names a schema, where it came
from, and the options it is meant to be compiled with (OpenAPI component bags and
the Kubernetes definitions file need `unreachableDefinitions`, or they produce
nothing). Every entry is compiled three times (`VARIANTS` in run.js):

| variant | options on top of the entry's own | why |
|---|---|---|
| `default` | none | what `compile(schema, name)` gives a user, formatter included |
| `strict` | `strictIndexSignatures`, `undefinedOptionalProperties`, `unreachableDefinitions`, `format: false` | index signatures and optional properties are where "property X is not assignable to index type" (TS2411) comes from; `unreachableDefinitions` emits every definition, used or not |
| `style` | `declarationStyle: 'type'`, `readonly`, `additionalProperties: false`, `enableConstEnums: false`, `unknownAny: false`, `format: false` | the other declaration form for every object (intersections instead of `extends`), `readonly` on every property and array, closed objects |

`--e2e` adds the `realWorld.*` cases from test/e2e (those fixtures are TypeScript
modules, so the runner transpiles them with `ts.transpileModule` and loads them in
node; remote `$ref`s are answered from the test suite's cache in test/__fixtures__).
The test suite already type-checks those under their own options; this puts them
through `strict` and `style` too.

Nothing here touches the network: a vendored schema with a remote `$ref` is a
mistake and fails the run.

## The schemas

Vendored under [schemas/](schemas/), byte-for-byte as served unless the `prep`
column says otherwise, from URLs pinned to a commit or tag so that
`node test/corpus/update.js` reproduces them exactly. Three more come from
[bench/fixtures](../../bench/fixtures/README.md) rather than being copied twice.
None of this ships in the npm package (test/ is in .npmignore).

| entry | source (pinned in sources.json) | size | prep | licence |
|---|---|---|---|---|
| github-rest-api | github/rest-api-description: descriptions/api.github.com/api.github.com.json | 2.6 MB | `openapi-components`: root = `{definitions: components.schemas}`, `#/components/schemas/` → `#/definitions/`, rest of the OpenAPI document dropped; 970-odd definitions, compiled with `unreachableDefinitions` | MIT |
| kubernetes-deployment-v1.30 | yannh/kubernetes-json-schema: v1.30.0-standalone-strict/deployment-apps-v1.json | 650 KB | as served; one fully inlined object tree, `additionalProperties: false` throughout | Apache-2.0 |
| gitlab-ci | gitlab-org/gitlab (tag v18.3.1-ee): app/assets/javascripts/editor/schema/ci.json | 110 KB | as served | MIT (the file is outside `ee/`) |
| compose-spec | compose-spec/compose-spec: schema/compose-spec.json | 77 KB | as served | Apache-2.0 |
| openapi-3.0-meta | OAI/OpenAPI-Specification (tag 3.1.0): schemas/v3.0/schema.json | 35 KB | as served | Apache-2.0 |
| json-api-1.0 | json-api/json-api: _schemas/1.0/schema.json | 17 KB | as served | CC0-1.0 |
| schemastore-github-action, -dependabot-2.0, -kustomization, -jest, -prettierrc, -launchsettings, -helm-chart | SchemaStore/schemastore: src/schemas/json/*.json | 8–51 KB each | as served | Apache-2.0 |
| kubernetes-definitions-v1.30, schemastore-tsconfig, schemastore-github-workflow | bench/fixtures/ | | see bench/fixtures/README.md | Apache-2.0 |

Left out on purpose: schemas that only work with network access (SchemaStore's
package.json, eslintrc, pyproject, cargo and renovate all `$ref` other hosted
schemas; AsyncAPI and CycloneDX reference sibling files), and the very large ones
(Stripe's and AWS CloudFormation's specs are the same OpenAPI-components shape as
the GitHub description at 1.7 and 3.4 MB; the AWS SAM schema is 16 MB).

## Adding or updating a schema

Add an entry to sources.json with a pinned `url`, its `license`, a `prep` (see the
header of update.js) and any `options` it needs; run `node test/corpus/update.js <name>`
to fetch it into schemas/; run `node test/corpus/run.js --only <name>`; add a row to
the table above. To move an entry to a newer upstream version, change the commit in
its URL and run update.js again. If an option set trips over a schema because of a
generator bug, fix the generator (or open an issue and leave the schema out until it
is fixed) rather than trimming the option set.
