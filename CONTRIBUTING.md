# Contributing

- Be sure to add a test for each change you make

## Tips

- Tests run with [`bun test`](https://bun.sh/docs/cli/test), straight from the TypeScript sources in test/
- Use `npm run tdd` to re-run tests when a file is modified
- Use `VERBOSE=true npm run tdd` to add logging output to the above command
- Use `bun test <filter>` to run a subset of the suite, and `bun test --update-snapshots` to re-record snapshots
- The CLI tests shell out to `node dist/src/cli.js`, so run `npm run build:server` (or `npm run pre-test`) before running `bun test` on its own
- Add `export let only=true` to a test in test/e2e to just run that test
- Add `export let exclude=true` to a test (or, add `.ignore` to its filename) in test/e2e to not run that test
- To debug a test, with breakpoints, follow the instructions [here](https://bun.sh/docs/runtime/debugger)
