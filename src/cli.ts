#!/usr/bin/env node

import { JSONSchema } from './JSONSchema'

import { readFile, writeFile } from 'mz/fs'

import { compile } from './index'

// require it instead of import till typings for stdin are not released
const stdin: (cb: (str: string) => void) => void = require('stdin')

// require it instead of import till typings for minimist are kind of broken
import minimist = require('minimist')

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2), {
  alias: {
    input: [ 'i' ],
    output: [ 'o' ]
  }
})
const argIn: string = argv._[0] || argv['input']
const argOut: string = argv._[1] || argv['output']

function readInput(): Promise<string> {
  if (!argIn) {
    return new Promise((resolve, reject) => {
      stdin((str: string) => {
        try {
          resolve(str)
        } catch (err) {
          reject(err)
        }
      })
    })
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

readInput()
  .then((s: string): JSONSchema => JSON.parse(s))
  .then((schema: JSONSchema): string => compile(schema, argIn))
  .then(writeOutput)
  .then(() => process.exit(0), (err: Error) => {
    process.stderr.write(err.message)
    process.exit(1)
  })
