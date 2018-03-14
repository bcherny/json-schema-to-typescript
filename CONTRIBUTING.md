# Contributing

- Be sure to add a test for each change you make

## Tips

- Use `npm run tdd` to compile and re-run tests when a file is modified
- Use `VERBOSE=true npm run tdd` to add logging output to the above command
- Add `export let only=true` to a test in test/e2e to just run that test
- Add `export let exclude=true` to a test in test/e2e to not run that test
- To debug a test, with breakpoints:
  1. Install [node-inspector](https://www.npmjs.com/package/node-inspector)
  2. Run `node-debug ./node_modules/ava/profile.js ./dist/test/test.js`
