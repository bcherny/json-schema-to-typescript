// package.json declares `engines.node: >=22.19.0`, but the test suite runs under
// bun rather than node, so it doesn't say anything about the oldest supported
// versions. This script exercises the *built* package instead — the artifact
// that actually ships — and CI runs it on the oldest node version we claim to
// support, so the declared floor stays honest.
//
// Usage: node test/smoke.cjs

const assert = require('assert')
const {execFileSync} = require('child_process')
const {join} = require('path')

const {compile, compileFromFile} = require('../dist/src/index.js')

const CLI = join(__dirname, '..', 'dist', 'src', 'cli.js')
const YAML_SCHEMA = join(__dirname, 'resources', 'Schema.yaml')

async function main() {
  const fromSchema = await compile(
    {
      title: 'Example',
      type: 'object',
      properties: {name: {type: 'string'}, age: {type: 'integer'}},
      required: ['name'],
    },
    'Example',
  )
  assert.match(fromSchema, /export interface Example/)
  assert.match(fromSchema, /name: string/)
  assert.match(fromSchema, /age\?: number/)

  // Exercises js-yaml, which is where an old-node incompatibility would most
  // likely show up first.
  const fromYaml = await compileFromFile(YAML_SCHEMA)
  assert.match(fromYaml, /export interface ExampleSchema/)
  assert.match(fromYaml, /firstName: string/)

  const fromCli = execFileSync(process.execPath, [CLI, YAML_SCHEMA], {encoding: 'utf-8'})
  assert.match(fromCli, /export interface ExampleSchema/)

  console.log(`smoke test passed on node ${process.version}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
