#!/usr/bin/env node

import {whiteBright} from 'cli-color'
import minimist = require('minimist')
import {readFile, writeFile, existsSync, lstatSync} from 'mz/fs'
import * as _mkdirp from 'mkdirp'
import * as _glob from 'glob'
import isGlob = require('is-glob')
import {promisify} from 'util'
import {join, resolve, basename, extname} from 'path'
import stdin = require('stdin')
import {compile, Options} from './index'

// Promisify mkdirp
const mkdirp = (path: string) =>
  new Promise((res, rej) => {
    _mkdirp(path, (err, made) => {
      if (err) rej(err)
      else res(made === null ? undefined : made)
    })
  })

const glob = promisify(_glob)

main(
  minimist(process.argv.slice(2), {
    alias: {
      help: ['h'],
      input: ['i'],
      output: ['o'],
      recursive: ['r']
    }
  })
)

async function main(argv: minimist.ParsedArgs) {
  if (argv.help) {
    printHelp()
    process.exit(0)
  }

  const argIn: string = argv._[0] || argv.input
  const argOut: string | undefined = argv._[1] || argv.output

  try {
    await processFiles(argIn, argOut, argv as Partial<Options>)
  } catch (e) {
    console.error(whiteBright.bgRedBright('error'), e)
    process.exit(1)
  }
}

async function processFiles(argIn: string, argOut: string | undefined, argv: Partial<Options>): Promise<void[]> {
  const files = isGlob(argIn) ? await glob(join(process.cwd(), argIn)) : [argIn]

  if (files.length === 0) {
    throw ReferenceError(
      `You passed a glob pattern "${argIn}", but there are no files that match that pattern in ${process.cwd()}`
    )
  }

  if (argOut && extname(argOut) === '' && !existsSync(argOut)) {
    await mkdirp(argOut)
  }

  return Promise.all(files.map(file => processFile(file, argOut, argv)))
}

async function processFile(file: string, out: string | undefined, argv: Partial<Options>): Promise<void> {
  out = out ? join(process.cwd(), out) : ''
  const schema = JSON.parse(await readInput(file))
  const ts = await compile(schema, file, argv)
  return await writeOutput(
    ts,
    existsSync(out) && lstatSync(out).isDirectory() ? join(out, `${basename(file, '.json')}.d.ts`) : out
  )
}

function readInput(argIn?: string) {
  if (!argIn) {
    return new Promise(stdin)
  }
  return readFile(resolve(process.cwd(), argIn), 'utf-8')
}

function writeOutput(ts: string, argOut: string | undefined): Promise<void> {
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
