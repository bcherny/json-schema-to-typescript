import {readFileSync} from 'fs'
import {JSONSchema4, JSONSchema6, JSONSchema7} from 'json-schema'
import {ParserOptions as $RefOptions} from '@apidevtools/json-schema-ref-parser'
import {cloneDeep, endsWith, merge} from 'lodash'
import {dirname, resolve} from 'path'
import {Options as PrettierOptions} from 'prettier'
import {format} from './formatter'
import {generate} from './generator'
import {normalize} from './normalizer'
import {optimize} from './optimizer'
import {nameAnonymousRecursiveTypes, parse, parseUnreachableDefinitions, Processed, UsedNames} from './parser'
import {dereference, SchemaSet} from './resolver'
import {prenormalize} from './prenormalizer'
import {error, stripExtension, log, parseFileAsJSONSchema, readVerbose} from './utils'
import {validate} from './validator'
import {isDeepStrictEqual} from 'util'
import {link} from './linker'
import {validateOptions} from './optionValidator'
import {JSONSchema as LinkedJSONSchema} from './types/JSONSchema'
import {AST} from './types/AST'
import {generateModules, Module} from './modules'

// These are all interfaces, so re-export them as types -- transpilers that
// compile a file at a time (bun, esbuild) can't tell on their own, and fail to
// resolve the re-export at runtime.
export type {EnumJSONSchema, JSONSchema, NamedEnumJSONSchema, CustomTypeJSONSchema} from './types/JSONSchema'

export interface Options {
  /**
   * [$RefParser](https://github.com/APIDevTools/json-schema-ref-parser) Options, used when resolving `$ref`s.
   * `dereference.maxDepth` (default 500) bounds how deep dereferencing may nest before it is reported as a
   * `$ref` cycle; raise it for schemas that genuinely nest or chain `$ref`s deeper than that.
   */
  $refOptions: $RefOptions & {dereference?: {maxDepth?: number}}
  /**
   * Default value for additionalProperties, when it is not explicitly set.
   */
  additionalProperties: boolean
  /**
   * Disclaimer comment prepended to the top of each generated file.
   */
  bannerComment: string
  /**
   * Custom function to provide a type name for a given schema
   */
  customName?: (schema: LinkedJSONSchema, keyNameFromDefinition: string | undefined) => string | undefined
  /**
   * Root directory for resolving [`$ref`](https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html)s.
   */
  cwd: string
  /**
   * Declare object types as `interface`s (`export interface A {...}`, supertypes in an
   * `extends` clause) or as `type` aliases (`export type A = {...}`, supertypes intersected:
   * `export type B = A & {...}`).
   */
  declarationStyle: 'interface' | 'type'
  /**
   * Declare external schemas referenced via `$ref`?
   */
  declareExternallyReferenced: boolean
  /**
   * Prepend enums with [`const`](https://www.typescriptlang.org/docs/handbook/enums.html#computed-and-constant-members)?
   */
  enableConstEnums: boolean
  /**
   * Create enums from JSON enums with eponymous keys
   */
  inferStringEnumKeysFromValues: boolean
  /**
   * Format code? Set this to `false` to improve performance.
   */
  format: boolean
  /**
   * Map from a string schema's [`format`](https://json-schema.org/understanding-json-schema/reference/string#format)
   * to the TypeScript type to emit for it, eg. `{'date-time': 'Date'}`. Like `tsType`, the type is
   * emitted verbatim (and `tsType`, `enum` and `const` take precedence). Formats not listed here
   * stay `string`.
   */
  formatTypes: Record<string, string>
  /**
   * Ignore maxItems and minItems for `array` types, preventing tuples being generated.
   */
  ignoreMinAndMaxItems: boolean
  /**
   * Maximum number of unioned tuples to emit when representing bounded-size array types,
   * before falling back to emitting unbounded arrays. Increase this to improve precision
   * of emitted types, decrease it to improve performance, or set it to `-1` to ignore
   * `minItems` and `maxItems`.
   */
  maxItems: number
  /**
   * Mark every property and index signature `readonly`, and every array and tuple type `readonly T[]`.
   */
  readonly: boolean
  /**
   * Map the schema's `readOnly: true` [annotation](https://json-schema.org/draft-07/json-schema-validation#rfc.section.10.3)
   * to TypeScript's `readonly`: an annotated property gets the `readonly` modifier, an annotated array or tuple becomes `readonly T[]`.
   */
  readonlyKeyword: boolean
  /**
   * Remove the optional modifier when a property has a default value.
   */
  removeOptionalIfDefaultExists: boolean
  /**
   * Append all index signatures with `| undefined` so that they are strictly typed.
   *
   * This is required to be compatible with `strictNullChecks`.
   */
  strictIndexSignatures: boolean
  /**
   * A [Prettier](https://prettier.io/docs/en/options.html) configuration.
   */
  style: PrettierOptions
  /**
   * Generate code for `definitions` that aren't referenced by the schema?
   */
  unreachableDefinitions: boolean
  /**
   * Append `| undefined` to the type of every optional property, for consumers that compile with
   * TypeScript's [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes).
   */
  undefinedOptionalProperties: boolean
  /**
   * Generate unknown type instead of any
   */
  unknownAny: boolean
}

export const DEFAULT_OPTIONS: Options = {
  $refOptions: {},
  additionalProperties: true, // TODO: default to empty schema (as per spec) instead
  bannerComment: `/* eslint-disable */
/**
* This file was automatically generated by json-schema-to-typescript.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run json-schema-to-typescript to regenerate this file.
*/`,
  cwd: process.cwd(),
  declarationStyle: 'interface',
  declareExternallyReferenced: true,
  enableConstEnums: true,
  inferStringEnumKeysFromValues: false,
  format: true,
  formatTypes: {},
  ignoreMinAndMaxItems: false,
  maxItems: 20,
  readonly: false,
  readonlyKeyword: false,
  removeOptionalIfDefaultExists: false,
  strictIndexSignatures: false,
  style: {
    bracketSpacing: false,
    printWidth: 120,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
  },
  unreachableDefinitions: false,
  undefinedOptionalProperties: false,
  unknownAny: true,
}

export function compileFromFile(filename: string, options: Partial<Options> = {}): Promise<string> {
  const schema = parseFileAsJSONSchema(filename, readSchemaFile(filename))
  return compile(schema, stripExtension(filename), {cwd: dirname(filename), ...options})
}

/**
 * Compiles a set of schema files together, into modules that import the types they share from
 * one another (`import type {…} from "./other.js"`) instead of each declaring its own copy of
 * them. What a file declares under `definitions`/`$defs`, and whatever its root type reaches, is
 * what the others can import from it; a type from a file outside the set is declared inline, as
 * `compileFromFile` would. The files of the set are read from disk once, up front; relative
 * `$ref`s resolve against the file they appear in.
 *
 * @param files each schema file to compile and the path its module will be written to (import
 * paths are computed between output paths); both relative to `options.cwd` (by default the
 * working directory), if not absolute
 * @returns the TypeScript for each file, in order. Writes nothing.
 */
export async function compileFiles(
  files: {filename: string; outputPath: string}[],
  options: Partial<Options> = {},
): Promise<string[]> {
  const cwd = options.cwd ?? DEFAULT_OPTIONS.cwd
  const members = files.map(_ => ({
    name: _.filename,
    file: resolve(cwd, _.filename),
    outputPath: resolve(cwd, _.outputPath),
  }))
  assertDistinct(members, 'file', 'are the same schema file')
  assertDistinct(members, 'outputPath', 'would both be written to the same file')

  const contents = new Map(members.map(_ => [_.file, readSchemaFile(_.file)]))
  const modules = await Promise.all(
    members.map(async ({name, file, outputPath}): Promise<Module> => {
      const schema = parseFileAsJSONSchema(file, contents.get(file)!)
      const set: SchemaSet = {file, files: contents}
      // A file's definitions are what the others import from it, so they are always declared
      const {
        ast,
        unreachableDefinitions,
        options: full,
      } = await compileToAST(schema, name, {...options, cwd: dirname(file), unreachableDefinitions: true}, set)
      return {file, outputPath, ast, unreachableDefinitions, options: full}
    }),
  )
  return generateModules(modules)
}

/** @param what is wrong with two of them having the same `key` */
function assertDistinct<K extends string>(members: ({name: string} & Record<K, string>)[], key: K, what: string) {
  const seen = new Map<string, string>()
  for (const member of members) {
    if (seen.has(member[key])) {
      throw new ReferenceError(
        `compileFiles: ${JSON.stringify(seen.get(member[key]))} and ${JSON.stringify(member.name)} ${what}`,
      )
    }
    seen.set(member[key], member.name)
  }
}

function readSchemaFile(filename: string): string {
  try {
    return readFileSync(filename, 'utf8')
  } catch {
    throw new ReferenceError(`Unable to read file "${filename}"`)
  }
}

export async function compile(
  schema: JSONSchema4 | JSONSchema6 | JSONSchema7,
  name: string,
  options: Partial<Options> = {},
): Promise<string> {
  // Initial clone to avoid mutating the input. Downstream code reads schema
  // keys generically rather than validating them against a specific draft's
  // shape (e.g. `exclusiveMaximum` is never interpreted as a boolean vs. a
  // number), so this cast doesn't change runtime behavior -- see #359.
  const _schema = cloneDeep(schema) as JSONSchema4
  const {ast, unreachableDefinitions, options: _options, time} = await compileToAST(_schema, name, options)

  const generated = generate(ast, _options, unreachableDefinitions)
  if (process.env.VERBOSE) {
    // (the guard spares joining the whole file when nobody is reading)
    log('magenta', 'generator', time(), '✅ Result:', generated.join(''))
  }

  const formatted = await format(generated, _options)
  log('white', 'formatter', time(), '✅ Result:', formatted)

  return formatted
}

/**
 * Every phase up to the generator, on `schema` itself (the caller passes a copy it owns). `set`
 * is passed only when compiling a set of files together: see `compileFiles`.
 */
async function compileToAST(
  schema: JSONSchema4,
  name: string,
  options: Partial<Options>,
  set?: SchemaSet,
): Promise<{ast: AST; unreachableDefinitions: AST[]; options: Options; time(): string}> {
  validateOptions(options)

  const _options = merge({}, DEFAULT_OPTIONS, options)

  readVerbose()
  const start = Date.now()
  function time() {
    return `(${Date.now() - start}ms)`
  }

  // normalize options
  if (!endsWith(_options.cwd, '/')) {
    _options.cwd += '/'
  }

  // Rewrites that have to see the raw document, before dereferencing (see ./prenormalizer)
  prenormalize(schema)
  log('yellow', 'prenormalizer', time(), '✅ Result:', schema)

  const {dereferencedPaths, dereferencedSchema} = await dereference(schema, _options, set)
  if (process.env.VERBOSE) {
    if (isDeepStrictEqual(schema, dereferencedSchema)) {
      log('green', 'dereferencer', time(), '✅ No change')
    } else {
      log('green', 'dereferencer', time(), '✅ Result:', dereferencedSchema)
    }
  }

  const linked = link(dereferencedSchema)
  log('green', 'linker', time(), '✅ No change')

  const errors = validate(linked, name)
  if (errors.length) {
    errors.forEach(_ => error(_))
    throw new ValidationError()
  }
  log('green', 'validator', time(), '✅ No change')

  const normalized = normalize(linked, dereferencedPaths, name, _options)
  log('yellow', 'normalizer', time(), '✅ Result:', normalized)

  const processed: Processed = new Map()
  const usedNames: UsedNames = new Set()
  const parsed = parse(normalized, _options, undefined, processed, usedNames)
  // Definitions that aren't referenced anywhere in the schema still need to be
  // declared. An object root declares them while its interface is parsed; for
  // any other kind of root they are parsed here and handed to the generator.
  const unreachableDefinitions = parseUnreachableDefinitions(normalized, _options, processed, usedNames)
  nameAnonymousRecursiveTypes([parsed, ...unreachableDefinitions], processed, dereferencedPaths, usedNames)
  log('blue', 'parser', time(), '✅ Result:', parsed)

  const optimizerMemo = new Map<AST, AST>()
  const optimized = optimize(parsed, _options, optimizerMemo)
  const optimizedUnreachableDefinitions = unreachableDefinitions.map(ast => optimize(ast, _options, optimizerMemo))
  log('cyan', 'optimizer', time(), '✅ Result:', optimized)

  return {ast: optimized, unreachableDefinitions: optimizedUnreachableDefinitions, options: _options, time}
}

export class ValidationError extends Error {}
