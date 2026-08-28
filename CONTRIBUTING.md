# Contributing

- Install dependencies with `bun install` ([bun](https://bun.sh) is this repo's package manager, script runner and test runner; CI uses the version in `.bun-version`)
- Be sure to add a test for each change you make

## Tips

- Tests run with [`bun test`](https://bun.sh/docs/cli/test), straight from the TypeScript sources in test/
- Use `bun run tdd` to re-run tests when a file is modified
- Use `VERBOSE=true bun run tdd` to add logging output to the above command
- Use `bun test <filter>` to run a subset of the suite, and `bun test --update-snapshots` to re-record snapshots
- The CLI tests shell out to `node dist/src/cli.js`, so run `bun run build:server` (or `bun run pre-test`) before running `bun test` on its own
- Add `export let only=true` to a test in test/e2e to just run that test
- Add `export let exclude=true` to a test (or, add `.ignore` to its filename) in test/e2e to not run that test
- To debug a test, with breakpoints, follow the instructions [here](https://bun.sh/docs/runtime/debugger)

## Releasing

Releases are published from CI. [publish.yml](.github/workflows/publish.yml) runs on every push to master and compares `version` in package.json with the npm registry: if that version is already on npm the run ends there, green; if it is new, the workflow installs dependencies, builds, runs the tests, publishes to npm (with a provenance attestation), and then tags `v<version>` and creates a GitHub release with that version's section of CHANGELOG.md as the notes.

So a release is a pull request that bumps `version` in package.json and adds a `## <version>` section to CHANGELOG.md, and merging it is what publishes it. No other merge to master publishes anything, and branches other than master never publish.

The workflow authenticates with npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so the repository holds no npm token. It needs a one-time setup by the package owner on npmjs.com: package *Settings* → *Trusted publishing* → *GitHub Actions*, with organization or user `bcherny`, repository `json-schema-to-typescript`, workflow filename `publish.yml`, no environment, and `npm publish` as the allowed action. Until that is done the `Publish to npm` job fails at its `npm publish` step and nothing is published (publish that version by hand as before, or register the publisher and re-run the failed job). Once it is done, don't also publish a merged version by hand: whichever publish comes second fails with "cannot publish over previously published version".
