#!/usr/bin/env node

import minimist = require('minimist')
import {readFile, writeFile, existsSync, lstatSync, readdirSync} from 'mz/fs'
import * as mkdirp from 'mkdirp'
import glob from 'glob-promise'
import isGlob = require('is-glob')
import {join, resolve, dirname, basename} from 'path'
import stdin = require('stdin')
import {compile, Options} from './index'
import {pathTransform, error} from './utils'

main(
  minimist<Partial<Options>>(process.argv.slice(2), {
    alias: {
      help: ['h'],
      input: ['i'],
      output: ['o']
    }
  })
)

async function main(argv: minimist.ParsedArgs & Partial<Options>) {
  if (argv.help) {
    printHelp()
    process.exit(0)
  }

  const argIn: string = argv._[0] || argv.input
  const argOut: string | undefined = argv._[1] || argv.output // the output can be omitted so this can be undefined

  const ISGLOB = isGlob(argIn)
  const ISDIR = isDir(argIn)

  try {
    if ((ISGLOB || ISDIR) && argOut && argOut.includes('.d.ts')) {
      const files = ISGLOB ? await glob(argIn) : getPaths(argIn)
      await processAllToOne(files, argOut, argv)
      return
    }
    if ((ISGLOB || ISDIR) && argOut === undefined) {
      // writing to stdout, set usedName so piping it to a file doesn't have duplicate names.
      // will leave duplicate banner comment to user though, we now support output to file where banner is taken care of.
      argv.usedNames = new Set<string>()
    }
    // Process input as either glob, directory, or single file
    if (ISGLOB) {
      await processGlob(argIn, argOut, argv)
    } else if (ISDIR) {
      await processDir(argIn, argOut, argv)
    } else {
      const result = await processFile(argIn, argv)
      outputResult(result, argOut)
    }
  } catch (e) {
    error(e)
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

  // we can do this concurrently for perf
  const results = await Promise.all(
    files.map(async file => {
      return [file, await processFile(file, argv)] as const
    })
  )

  // careful to do this serially
  results.forEach(([file, result]) => {
    const outputPath = argOut && `${argOut}/${basename(file, '.json')}.d.ts`
    outputResult(result, outputPath)
  })
}

async function processDir(argIn: string, argOut: string | undefined, argv: Partial<Options>) {
  const files = getPaths(argIn)

  // we can do this concurrently for perf
  const results = await Promise.all(
    files.map(async file => {
      if (!argOut) {
        return [file, await processFile(file, argv)] as const
      } else {
        const outputPath = pathTransform(argOut, argIn, file)
        return [file, await processFile(file, argv), outputPath] as const
      }
    })
  )

  // careful to do this serially
  results.forEach(([file, result, outputPath]) =>
    outputResult(result, outputPath ? `${outputPath}/${basename(file, '.json')}.d.ts` : undefined)
  )
}

async function processAllToOne(files: string[], outputFile: string, argv: Partial<Options>) {
  // we will read all files in parallel but will do the processing in series
  // because we need to ensure no race conditions with usedNames.
  const usedNames = new Set<string>()
  const schemas = await Promise.all(files.map(async file => [file, JSON.parse(await readInput(file))] as const))
  let first = true
  let wholeText = ''
  for (const [filename, schema] of schemas) {
    // override banner for each subsequent files so the banner only appears at the top.
    const omitBanner = first ? {} : {bannerComment: `////////////`}
    // again, we don't parallelize this to ensure no race conditions with usedNames.
    const text = await compile(schema, filename, {usedNames, ...argv, ...omitBanner})
    wholeText += (first ? '' : '\n') + text
    first = false
  }
  outputResult(wholeText, outputFile)
}

async function outputResult(result: string, outputPath: string | undefined): Promise<void> {
  if (!outputPath) {
    process.stdout.write(result)
  } else {
    if (!isDir(dirname(outputPath))) {
      mkdirp.sync(dirname(outputPath))
    }
    return await writeFile(outputPath, result)
  }
}

async function processFile(argIn: string, argv: Partial<Options>): Promise<string> {
  const schema = JSON.parse(await readInput(argIn))
  return compile(schema, argIn, argv)
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
  --format
      Format code? Set this to false to improve performance.
  --style.XXX=YYY
      Prettier configuration
  --unknownAny
      Output unknown type instead of any type
  --unreachableDefinitions
      Generates code for definitions that aren't referenced by the schema
  --onlyExportMain
      exports only the main schema(s), any definitions are kept internal.
`
  )
}
