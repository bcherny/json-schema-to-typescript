# Contributing

- Be sure to add a test for each change you make

## Tips

- Use `npm run tdd` to compile and re-run tests when a file is modified
- Use `VERBOSE=true npm run tdd` to add logging output to the above command
- Add `export let only=true` to a test in test/e2e to just run that test
- Add `export let exclude=true` to a test (or, add `.ignore` to its filename) in test/e2e to not run that test
- To debug a test, with breakpoints:
  1. Run `npm run pretest`
  2. Follow the instructions [here](https://github.com/avajs/ava/blob/master/docs/recipes/debugging-with-vscode.md) for VSCode, [here](https://github.com/avajs/ava/blob/master/docs/recipes/debugging-with-webstorm.md) for Webstorm, or [here](https://github.com/avajs/ava/blob/master/docs/recipes/debugging-with-chrome-devtools.md) for Chrome Devtools
