#!/usr/bin/env node

import {whiteBright} from 'cli-color'
import minimist = require('minimist')
import {readFile, writeFile, existsSync, lstatSync, readdirSync} from 'mz/fs'
import * as _mkdirp from 'mkdirp'
import * as _glob from 'glob'
import isGlob = require('is-glob')
import {promisify} from 'util'
import {join, resolve, dirname, basename} from 'path'
import stdin = require('stdin')
import {compile, Options} from './index'
import {pathTransform} from './utils'

// Promisify mkdirp & glob
const mkdirp = (path: string): Promise<_mkdirp.Made> =>
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
      output: ['o']
    }
  })
)

async function main(argv: minimist.ParsedArgs) {
  if (argv.help) {
    printHelp()
    process.exit(0)
  }

  const argIn: string = argv._[0] || argv.input
  const argOut: string | undefined = argv._[1] || argv.output // the output can be omitted so this can be undefined

  const ISGLOB = isGlob(argIn)
  const ISDIR = isDir(argIn)

  if ((ISGLOB || ISDIR) && argOut && argOut.includes('.d.ts')) {
    throw new ReferenceError(
      `You have specified a single file ${argOut} output for a multi file input ${argIn}. This feature is not yet supported, refer to issue #272 (https://github.com/bcherny/json-schema-to-typescript/issues/272)`
    )
  }

  try {
    // Process input as either glob, directory, or single file
    if (ISGLOB) {
      await processGlob(argIn, argOut, argv as Partial<Options>)
    } else if (ISDIR) {
      await processDir(argIn, argOut, argv as Partial<Options>)
    } else {
      await processFile(argIn, argOut, argv as Partial<Options>)
    }
  } catch (e) {
    console.error(whiteBright.bgRedBright('error'), e)
    process.exit(1)
  }
}

// check if path is an existing directory
function isDir(path: string): boolean {
  return existsSync(path) && lstatSync(path).isDirectory()
}

async function processGlob(argIn: string, argOut: string | undefined, argv: Partial<Options>) {
  const files = await glob(argIn) // execute glob pattern match

  if (files.length === 0) {
    throw ReferenceError(
      `You passed a glob pattern "${argIn}", but there are no files that match that pattern in ${process.cwd()}`
    )
  }
  // create output directory if it does not exist
  if (argOut && !existsSync(argOut)) {
    await mkdirp(argOut)
  }

  await Promise.all(
    files.map(file => {
      const outPath = argOut && `${argOut}/${basename(file, '.json')}.d.ts`
      return processFile(file, outPath, argv)
    })
  )
}

async function processDir(argIn: string, argOut: string | undefined, argv: Partial<Options>) {
  const files = getPaths(argIn)

  await Promise.all(
    files.map(file => {
      if (!argOut) {
        return processFile(file, argOut, argv)
      } else {
        let outPath = pathTransform(argOut, file)
        if (!isDir(dirname(outPath))) {
          _mkdirp.sync(dirname(outPath))
        }
        outPath = outPath.replace('.json', '.d.ts')
        return processFile(file, outPath, argv)
      }
    })
  )
}

async function processFile(argIn: string, argOut: string | undefined, argv: Partial<Options>): Promise<void> {
  const schema = JSON.parse(await readInput(argIn))
  const ts = await compile(schema, argIn, argv)

  if (!argOut) {
    process.stdout.write(ts)
  } else {
    return await writeFile(argOut, ts)
  }
}

function getPaths(path: string, paths: string[] = []) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(resolve(path)).forEach(item => getPaths(join(path, item), paths))
  } else {
    paths.push(path)
  }

  return paths
}

function readInput(argIn?: string) {
  if (!argIn) {
    return new Promise(stdin)
  }
  return readFile(resolve(process.cwd(), argIn), 'utf-8')
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
