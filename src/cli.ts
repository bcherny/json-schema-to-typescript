#!/usr/bin/env node

import minimist from 'minimist'
import {readFileSync, writeFileSync, existsSync, lstatSync, readdirSync, mkdirSync} from 'fs'
import {omit} from 'lodash'
import {glob, isDynamicPattern} from 'tinyglobby'
import {join, resolve, dirname} from 'path'
import {resolveConfig} from 'prettier'
import {compile, compileFiles, DEFAULT_OPTIONS, Options} from './index'
import {pathTransform, error, parseFileAsJSONSchema, justName, stripExtension} from './utils'

// cwd and style are deliberately left out of the CLI defaults: processFile()
// computes a per-file cwd and loads the closest Prettier config. Explicit CLI
// flags are applied afterwards, so they still take precedence.
const defaultOptions = omit(DEFAULT_OPTIONS, ['cwd', 'style'])

main(
  minimist(process.argv.slice(2), {
    alias: {
      help: ['h'],
      input: ['i'],
      output: ['o'],
    },
    boolean: [
      'additionalProperties',
      'declareExternallyReferenced',
      'enableConstEnums',
      'format',
      'ignoreMinAndMaxItems',
      'imports',
      'readonly',
      'readonlyKeyword',
      'removeOptionalIfDefaultExists',
      'strictIndexSignatures',
      'undefinedOptionalProperties',
      'unknownAny',
      'unreachableDefinitions',
    ],
    default: defaultOptions,
    string: ['bannerComment', 'cwd', 'declarationStyle'],
  }),
)

async function main(argv: minimist.ParsedArgs) {
  if (argv.help) {
    printHelp()
    process.exit(0)
  }

  // `--style.X=false` and `--style.X false` reach us as the string 'false' (#199).
  // Style flags are not registered as minimist booleans, because a registered
  // boolean defaults to false and would override the project's Prettier config.
  for (const key in argv.style) {
    if (argv.style[key] === 'true' || argv.style[key] === 'false') {
      argv.style[key] = argv.style[key] === 'true'
    }
  }

  const argIn: string = argv._[0] || argv.input
  const argOut: string | undefined = argv._[1] || argv.output // the output can be omitted so this can be undefined

  const ISGLOB = argIn && isDynamicPattern(argIn)
  const ISDIR = !!argIn && isDir(argIn)

  try {
    // Defend against unquoted glob expansion (or other shell mistakes) silently supplying extra
    // positional arguments. A positional that competes with an explicitly-passed --input/--output
    // flag for the same slot, or overflows past the two positional slots (input, output) this CLI
    // supports, risks a source file being misread as an output path and overwritten.
    // `in.json -o out.d.ts` (positional input, flagged output) stays valid.
    if (
      argv._.length > 2 ||
      (argv.input !== undefined && argv._.length > 0) ||
      (argv.output !== undefined && argv._.length > 1)
    ) {
      throw new ReferenceError(
        `Unexpected extra argument(s): ${argv._.join(', ')}. json-schema-to-typescript accepts at most one input path and one output path. If you passed a glob to --input, quote it (e.g. -i "schemas/**/*.json") so your shell doesn't expand it first.`,
      )
    }
    if ((ISGLOB || ISDIR) && argOut && argOut.includes('.d.ts')) {
      throw new ReferenceError(
        `You have specified a single file ${argOut} output for a multi file input ${argIn}. This feature is not yet supported, refer to issue #272 (https://github.com/bcherny/json-schema-to-typescript/issues/272)`,
      )
    }

    if (argv.imports) {
      if (!ISGLOB && !ISDIR) {
        throw new ReferenceError(
          '--imports compiles a directory or glob of schemas together, importing shared types between the output files; a single input file has no other file to import from.',
        )
      }
      if (!argOut) {
        throw new ReferenceError(
          '--imports needs an output directory (--output): import paths are computed between the output files.',
        )
      }
      if (argv.cwd !== undefined) {
        throw new ReferenceError(
          "--cwd cannot be combined with --imports: each file's $refs are resolved against that file's own location.",
        )
      }
    }
    // Process input as either glob, directory, or single file
    if (ISGLOB) {
      await processGlob(argIn, argOut, argv as Partial<Options>)
    } else if (ISDIR) {
      await processDir(argIn, argOut, argv as Partial<Options>)
    } else {
      outputResult(await processFile(argIn, argOut, argv as Partial<Options>), argOut)
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
  const files = await glob(argIn, {expandDirectories: false}) // execute glob pattern match

  if (files.length === 0) {
    throw ReferenceError(
      `You passed a glob pattern "${argIn}", but there are no files that match that pattern in ${process.cwd()}`,
    )
  }

  await processFiles(
    files.map(file => [file, argOut && `${argOut}/${justName(file)}.d.ts`]),
    argv,
  )
}

async function processDir(argIn: string, argOut: string | undefined, argv: Partial<Options>) {
  await processFiles(
    getPaths(argIn).map(file => [file, argOut && `${pathTransform(argOut, argIn, file)}/${justName(file)}.d.ts`]),
    argv,
  )
}

/**
 * Compiles each file to its output path (or stdout) -- one file at a time, or, with
 * `--imports`, as one set of modules that import shared types from each other.
 */
async function processFiles(files: [string, string | undefined][], argv: Partial<Options> & {imports?: boolean}) {
  let results: (readonly [string, string | undefined])[]
  if (argv.imports) {
    // main() has checked there is an output directory
    const compiled = await compileFiles(
      files.map(([file, out]) => ({filename: file, outputPath: out!})),
      {...argv, style: await styleFor(files[0]?.[1] ?? '.', argv)},
    )
    results = files.map(([, out], i) => [compiled[i], out] as const)
  } else {
    // we can do this concurrently for perf
    results = await Promise.all(files.map(async ([file, out]) => [await processFile(file, out, argv), out] as const))
  }
  // careful to do this serially
  results.forEach(([result, outputPath]) => outputResult(result, outputPath))
}

function outputResult(result: string, outputPath: string | undefined): void {
  if (!outputPath) {
    process.stdout.write(result)
  } else {
    if (!isDir(dirname(outputPath))) {
      mkdirSync(dirname(outputPath), {recursive: true})
    }
    writeFileSync(outputPath, result)
  }
}

async function processFile(argIn: string, outputPath: string | undefined, argv: Partial<Options>): Promise<string> {
  const {filename, contents} = await readInput(argIn)
  const schema = parseFileAsJSONSchema(filename, contents)
  // When writing to stdout, the Prettier config is the one for the .d.ts next to
  // the input (stdin: <cwd>/stdin.d.ts).
  const configPath = outputPath || `${filename ? stripExtension(filename) : 'stdin'}.d.ts`
  // Resolve $refs relative to the directory of the file being compiled, not
  // process.cwd(), unless the user explicitly passed --cwd (see #324).
  const cwd = filename ? dirname(resolve(process.cwd(), filename)) : undefined
  // filename is null when input comes from stdin (no file to derive a name from), so fall
  // back to the same placeholder name used elsewhere for schemas without a derivable name.
  return compile(schema, filename ?? 'NoName', {
    ...(cwd ? {cwd} : {}),
    ...argv,
    style: await styleFor(configPath, argv),
  })
}

/**
 * The Prettier config that applies to the file being written (so `overrides` keyed to *.ts /
 * *.d.ts apply and ones keyed to *.json do not), under any explicit --style flags. The output is
 * always TypeScript, so a configured `parser` is not taken over.
 */
async function styleFor(outputPath: string, argv: Partial<Options>): Promise<Options['style']> {
  const prettierConfig = omit((await resolveConfig(resolve(process.cwd(), outputPath))) || {}, 'parser')
  return {...prettierConfig, ...argv.style}
}

function getPaths(path: string, paths: string[] = []) {
  if (isDir(path)) {
    readdirSync(resolve(path)).forEach(item => getPaths(join(path, item), paths))
  } else {
    paths.push(path)
  }

  return paths
}

async function readInput(argIn?: string): Promise<{filename: string | null; contents: string}> {
  if (!argIn) {
    return {
      filename: null,
      contents: await readStream(process.stdin),
    }
  }
  return {
    filename: argIn,
    contents: readFileSync(resolve(process.cwd(), argIn), 'utf-8'),
  }
}

async function readStream(stream: NodeJS.ReadStream): Promise<string> {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
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

  --additionalProperties
      Default value for additionalProperties, when it is not explicitly set
  --cwd=XXX
      Root directory for resolving $ref
  --declarationStyle=interface|type
      Declare object types as interfaces (default) or as type aliases
  --declareExternallyReferenced
      Declare external schemas referenced via '$ref'?
  --enableConstEnums
      Prepend enums with 'const'?
  --inferStringEnumKeysFromValues
      Create enums from JSON enums instead of union types
  --format
      Format code? Set this to false to improve performance.
  --formatTypes.FORMAT=TYPE
      Emit TYPE for strings with the given format (eg.
      --formatTypes.date-time=Date). Repeat for each format.
  --imports
      When IN_FILE is a directory or glob: import types that live in another of the
      compiled files from that file's module, instead of declaring a copy in each.
      (Experimental; off by default.)
  --maxItems
      Maximum number of unioned tuples to emit when representing bounded-size
      array types, before falling back to emitting unbounded arrays. Increase
      this to improve precision of emitted types, decrease it to improve
      performance, or set it to -1 to ignore minItems and maxItems.
  --readonly
      Mark every property and index signature readonly, and every array type readonly T[]
  --readonlyKeyword
      Mark properties annotated readOnly: true as readonly, and emit readOnly
      arrays and tuples as readonly T[]
  --removeOptionalIfDefaultExists
      Remove the optional modifier when a property has a default value
  --style.XXX=YYY
      Prettier configuration
  --$refOptions.XXX=YYY
      Options for the $ref resolver (json-schema-ref-parser), eg.
      '--$refOptions.dereference.externalReferenceResolution=root'. Quote it for your shell.
  --undefinedOptionalProperties
      Append '| undefined' to the type of optional properties, for consumers
      that compile with TypeScript's exactOptionalPropertyTypes
  --unknownAny
      Output unknown type instead of any type
  --unreachableDefinitions
      Generates code for definitions that aren't referenced by the schema
`,
  )
}
