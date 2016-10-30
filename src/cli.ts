#!/usr/bin/env node

import { readFile, writeFile } from 'mz/fs'
import { basename, dirname, join as joinPaths } from 'path'

import { compile } from './index'
import { JSONSchema } from './JSONSchema'

// require it instead of import till typings for stdin are not released
const stdin: (cb: (str: string) => void) => void = require('stdin')

// require it instead of import till typings for minimist are kind of broken
import minimist = require('minimist')

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2), {
  alias: {
    help: [ 'h' ],
    input: [ 'i' ],
    output: [ 'o' ]
  }
})

if (argv['help']) {
  printHelp()
  process.exit(0)
}

const argIn: string = argv._[0] || argv['input']
const argOut: string = argv._[1] || argv['output'] || getOutFilePath(argIn)

readInput()
  .then((s: string): JSONSchema => JSON.parse(s))
  .then((schema: JSONSchema): string => compile(schema, argIn))
  .then(writeOutput)
  .then(() => process.exit(0), (err: Error) => {
    process.stderr.write(err.message)
    process.exit(1)
  })

function getOutFilePath(inFilePath?: string) {
  if (!inFilePath) {
    return
  }

  const outFileName = basename(inFilePath, '.json') + '.d.ts'

  return joinPaths(dirname(inFilePath), outFileName)
}

function readInput(): Promise<string> {
  if (!argIn) {
    return new Promise(stdin)
  }

  return readFile(argIn)
}

function writeOutput(compiled: string): Promise<void> {
  if (!argOut) {
    try {
      process.stdout.write(compiled)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return writeFile(argOut, compiled)
}

function printHelp() {
  const pkg = require('../package.json')

  process.stdout.write([
    `${pkg.name} ${pkg.version}`,
    'Usage: json2ts [--input, -i] [IN_FILE] [--output, -o] [OUT_FILE]',
    '',
    'With no IN_FILE, or when IN_FILE is -, read standard input.',
    'With no OUT_FILE and when IN_FILE is specified, create `.d.ts` file in the same directory.',
    'With no OUT_FILE nor IN_FILE, write to standard output.'
  ].join('\n'))
}
