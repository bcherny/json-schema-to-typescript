#!/usr/bin/env node

import { JSONSchema4 } from 'json-schema'
import minimist = require('minimist')
import { readFile, writeFile } from 'mz/fs'
import { resolve } from 'path'
import stdin = require('stdin')
import { compile, Options } from './index'
import { whiteBright } from 'cli-color'

main(minimist(process.argv.slice(2), {
  alias: {
    help: ['h'],
    input: ['i'],
    output: ['o']
  }
}))

async function main(argv: minimist.ParsedArgs) {

  if (argv.help) {
    printHelp()
    process.exit(0)
  }

  const argIn: string = argv._[0] || argv.input
  const argOut: string = argv._[1] || argv.output

  try {
    const schema: JSONSchema4 = JSON.parse(await readInput(argIn))
    const ts = await compile(schema, argIn, argv as Partial<Options>)
    await writeOutput(ts, argOut)
  } catch (e) {
    console.error(whiteBright.bgRedBright('error'), e)
    process.exit(1)
  }

}

function readInput(argIn?: string) {
  if (!argIn) {
    return new Promise(stdin)
  }
  return readFile(resolve(process.cwd(), argIn), 'utf-8')
}

function writeOutput(ts: string, argOut: string): Promise<void> {
  if (!argOut) {
    try {
      process.stdout.write(ts)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return writeFile(argOut, ts)
}

function printHelp() {
  const pkg = require('../../package.json')

  process.stdout.write(
`
${pkg.name} ${pkg.version}
Usage: json2ts [--input, -i] [IN_FILE] [--output, -o] [OUT_FILE] [OPTIONS]

With no IN_FILE, or when IN_FILE is -, read standard input.
With no OUT_FILE and when IN_FILE is specified, create .d.ts file in the same directory.
With no OUT_FILE nor IN_FILE, write to standard output.

You can use any of the following options by adding them at the end.
Boolean values can be set to false using the 'no-' prefix.

  --cwd=XXX
      Root directory for resolving $ref
  --declareExternallyReferenced
      Declare external schemas referenced via '$ref'?
  --enableConstEnums
      Prepend enums with 'const'?
  --style.XXX=YYY
      Prettier configuration
  --unreachableDefinitions
      Generates code for definitions that aren't referenced by the schema
`
  )
}
