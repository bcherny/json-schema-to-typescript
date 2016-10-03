import { CircularReferenceError } from './errors'
import { EnumJSONSchema, JSONSchema, NamedEnumJSONSchema, QualifiedJSONSchema, RefJSONSchema } from './JSONSchema'
import * as TsType from './TsTypes'
import { nameToTsSafeName, tryFn } from './utils'
import { readFile, readFileSync } from 'fs'
import { isPlainObject, last, map, merge, zip } from 'lodash'
import { parse, ParsedPath, resolve } from 'path'

enum RuleType {
  Any, TypedArray, Enum, AllOf, AnyOf, Reference, NamedSchema, AnonymousSchema,
  String, Number, Null, Object, Array, Boolean, Literal, NamedEnum, Union
}

enum EnumType { Boolean, Number, String }

export interface Settings {
  /**
   * Directory that local filesystem $refs should be resolved relative to
   */
  baseDir?: string
  declareReferenced?: boolean
  endPropertyWithSemicolon?: boolean
  endTypeWithSemicolon?: boolean
  useConstEnums?: boolean
  useFullReferencePathAsName?: boolean
}

interface Path {
  file: string
  id: string
  path: string
}

class Compiler {

  static DEFAULT_SETTINGS: Settings = {
    baseDir: '.',
    declareReferenced: true,
    endPropertyWithSemicolon: true,
    endTypeWithSemicolon: true,
    useConstEnums: true,
    useFullReferencePathAsName: false
  }

  static DEFAULT_SCHEMA: JSONSchema = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
  }

  constructor(
    private schema: JSONSchema,
    filePath: string | undefined = '',
    settings?: Settings
  ) {
    this.fileName = resolve(filePath)
    this.filePath = parse(this.fileName)
    this.declarations = new Map
    this.id = schema.id || schema.title || this.filePath.name || 'Interface1'
    this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings)

    const path: Path = { file: this.fileName, id: `${this.fileName}#/`, path: `#/` }
    this.declareType(this.toTsType(this.schema, '', true, path) as TsType.Interface, this.id, path)
    this.namedEnumCounter = 0
  }

  toDeclaration(): string {
    return Array
      .from(this.declarations.values())
      .map(_ => _.toDeclaration(this.settings))
      .join('\n')
  }

  private settings: Settings
  private id: string
  private declarations: Map<string, TsType.TsType<any>>
  private fileName: string
  private filePath: ParsedPath
  private namedEnumCounter: number

  // private resolveRefFromLocalFS<T>(path: Path, propName: string): TsType.TsType<T> {
  //   const contents = resolvePathFromLocalFS(path)
  //   const type = this.toTsType<T>(contents, propName, true, path)
  //   type.id = type.id
  //     ? type.toType(this.settings)
  //     : parse(path.file).name

  //   return type
  // }

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  // only called in case of a $ref type
  private resolveRef(refPath: string, propName: string, path: Path): TsType.TsType<any> {

    // qualify path
    const qualifiedPath = qualifyPath(refPath, path.file)

    if (isCircularRef(qualifiedPath)) {
      throw new CircularReferenceError(`Error! Detected circular reference in schema: ${getCircularRefPath(qualifiedPath).join(' -> ')}`)
    }

    // TODO: use TsType.Reference, or TsType.Interface directly
    if (qualifiedPath.file === path.file && (qualifiedPath.path === '#' || qualifiedPath.path === '#/')) {
      return TsType.Interface.reference(this.id)
    }

    const parts = qualifiedPath.path.slice(2).split('/')
    const existingRef = this.declarations.get(qualifiedPath.id)
    let $ref: TsType.TsType<any>

    if (existingRef) {
      // resolve existing reference
      $ref = existingRef
    } else {
      // resolve from elsewhere in the schema
      const ref = resolvePath(qualifiedPath)
      if (!ref) {
        throw new ReferenceError(`Property "${qualifiedPath.path}" on schema ${this.id} in ${path.file} is a $ref that points at the path "${refPath}", but that path does not exist on this schema. Double check that "${path.path}" points to the correct path.`)
      }
      $ref = this.toTsType(ref, undefined, false, qualifiedPath)
    }

    // rule: declare if referenced via $ref
    if (this.settings.declareReferenced) {
      const id = $ref.id || ($ref as any).title || (this.settings.useFullReferencePathAsName ? parts.join('/') : last(parts))
      this.declareType($ref, id, qualifiedPath)
    }

    return $ref
  }

  private declareType<T>(type: TsType.TsType<T>, id: string, path: Path) {
    type.id = nameToTsSafeName(id)
    this.declarations.set(path.id, type)
    return type
  }

  private generateEnumName(rule: JSONSchema, propName: string | undefined): string {
    return rule.id || propName || `Enum${this.namedEnumCounter++}`
  }

  private generateTsType(rule: JSONSchema, propName: string | undefined, path: Path): TsType.TsType<any> {
    switch (getRuleType(rule)) {
      case RuleType.AnonymousSchema:
      case RuleType.NamedSchema:
        return this.toTsDeclaration(rule, path)

      case RuleType.Enum:
        return new TsType.Union(
          (rule as EnumJSONSchema).enum.map(_ => new TsType.Literal(_))
        )

      case RuleType.NamedEnum:
        validateNamedEnum(rule as NamedEnumJSONSchema)

        const name = this.generateEnumName(rule, propName)
        const tsEnum = new TsType.Enum(name,
          zip(
            (rule as NamedEnumJSONSchema).tsEnumNames,
            (rule as NamedEnumJSONSchema).enum
          ).map(_ => new TsType.EnumValue(_))
        )
        this.declareType(tsEnum, name, qualifyPath(path.path, path.file)) // TODO
        return tsEnum

      case RuleType.Any: return new TsType.Any
      case RuleType.Literal: return new TsType.Literal(rule)
      case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items!, undefined, false, path))
      case RuleType.Array: return new TsType.Array
      case RuleType.Boolean: return new TsType.Boolean
      case RuleType.Null: return new TsType.Null
      case RuleType.Number: return new TsType.Number
      case RuleType.Object: return new TsType.Object
      case RuleType.String: return new TsType.String
      case RuleType.AllOf:
        return new TsType.Intersection(rule.allOf!.map(_ => this.toTsType(_, undefined, false, path)))
      case RuleType.AnyOf:
        return new TsType.Union(rule.anyOf!.map(_ => this.toTsType(_, undefined, false, path)))
      case RuleType.Reference:
        return this.resolveRef(rule.$ref!, propName!, path)
      case RuleType.Union:
        return new TsType.Union((rule.type as any[]).map(_ => this.toTsType({ type: _ }, undefined, false, path)))
    }
    throw new Error('Unknown rule:' + rule.toString())
  }

  private toTsType<T>(
    schema: JSONSchema,
    propName: string | undefined,
    isReference: boolean,
    path: Path
  ): TsType.TsType<T> {
    const type = this.generateTsType(schema, propName, path)

    // explicitly declare ID?
    const explicitId = schema.id || schema.title
    if (explicitId) {
      type.id = explicitId
      if (this.settings.declareReferenced) {
        this.declareType(type, type.id, path)
      }
    }

    // description?
    type.description = type.description || schema.description

    return type
  }
  private toTsDeclaration(schema: JSONSchema, path: Path): TsType.Interface | TsType.Null {
    const copy = merge<QualifiedJSONSchema>({}, Compiler.DEFAULT_SCHEMA, schema)
    const props = map(copy.properties, (v: JSONSchema, k: string) => ({
      name: k,
      required: isRequired(k, copy),
      type: this.toTsType(v, k, false, path)
    }))
    if (props.length === 0 && !('additionalProperties' in schema)) {
      if ('default' in schema)
        return new TsType.Null
    }
    if (supportsAdditionalProperties(copy)) {
      const short = copy.additionalProperties === true
      if (short && props.length === 0)
        return new TsType.Any
      const type = short
        ? new TsType.Any
        : this.toTsType(copy.additionalProperties as JSONSchema, undefined, false, path)
      props.push({
        name: '[k: string]',
        required: true,
        type
      } as TsType.TsProp<typeof type>)
    }
    return new TsType.Interface(props)
  }
}

export function compile(
  schema: JSONSchema,
  path: string | undefined,
  settings?: Settings
): string {
  return new Compiler(schema, path, settings).toDeclaration()
}

export function compileFromFile(inputFilename: string): Promise<string | NodeJS.ErrnoException> {
  return new Promise((resolve, reject) =>
    readFile(inputFilename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(compile(JSON.parse(data.toString()), inputFilename))
      }
    })
  )
}

// helpers

// used to generate human-friendly debug messages
function getCircularRefPath(path: Path, acc: string[] = []): string[] {
  if (acc.indexOf(path.id) > -1) return [...acc, path.id]
  const pointer = resolvePath(path) as RefJSONSchema
  return getCircularRefPath(qualifyPath(pointer.$ref, path.file), [...acc, path.id])
}

// TODO: cache reads
function resolvePathFromLocalFS(path: Path): JSONSchema {

  const file = tryFn(
    () => readFileSync(path.file).toString(),
    () => { throw new ReferenceError(`Unable to find referenced file "${path.file}"`) }
  )

  return tryFn(
    () => JSON.parse(file) as JSONSchema,
    () => { throw new TypeError(`Referenced local schema "${path.file}" contains malformed JSON`) }
  )
}

// eg. (this, '#/definitions/foo/bar') => Bar
function resolvePath<T>(path: Path): JSONSchema | undefined {
  const _resolve = (schema: JSONSchema, parts: string[]): JSONSchema | undefined => {
    switch (parts.length) {
      case 0: return schema
      case 1: return schema[parts[0]]
      default: return _resolve(schema[parts[0]], parts.slice(1))
    }
  }

  // filter out "" in case of # or #/
  return _resolve(resolvePathFromLocalFS(path), path.path.slice(2).split('/').filter(Boolean))
}

function isCircularRef(path: Path, acc: string[] = []): boolean {

  if (acc.indexOf(path.id) > -1) return true

  const pointer = resolvePath(path)
  if (!pointer) return false

  if (getRuleType(pointer) === RuleType.Reference) {
    return isCircularRef(
      qualifyPath((pointer as RefJSONSchema).$ref, path.file),
      [...acc, path.id]
    )
  }

  return false
}

function qualifyPath(path: string, relativeToFile: string): Path {

  // #
  // #/
  if (path === '#' || path === '#/') return { file: relativeToFile, id: `${relativeToFile}#`, path: '#' }

  // #/foo/bar
  if (path.startsWith('#')) return { file: relativeToFile, id: `${relativeToFile}${path}`, path }

  // http://foo.com/file.json
  // http://foo.com/file.json#/foo/bar
  if (path.startsWith('http://') || path.startsWith('https://')) throw new ReferenceError(`Remote http references are not yet supported.  Could not read "${path}"`)

  // ../../file.json
  // file.json#/foo/bar
  const [filename, selector] = path.split('#')
  const file = resolve(relativeToFile, filename)
  const _path = `#${selector || ''}`
  return { file, id: `${file}${_path}`, path: _path }

}

function getRuleType(rule: JSONSchema): RuleType {

  // normalize rule
  // TODO: move this somewhere else
  // TODO: avoid mutating rule
  if (rule.type && Array.isArray(rule.type) && rule.type.length === 1) {
    rule.type = rule.type[0]
  }

  if (rule.type === 'array' && rule.items) {
    return RuleType.TypedArray
  }
  if (rule.enum && rule.tsEnumNames) {
    return RuleType.NamedEnum
  }
  if (rule.enum) {
    return RuleType.Enum
  }
  if (rule.properties || rule.additionalProperties) {
    return RuleType.NamedSchema
  }
  if (rule.allOf) {
    return RuleType.AllOf
  }
  if (rule.anyOf) {
    return RuleType.AnyOf
  }
  if (rule.$ref) {
    return RuleType.Reference
  }
  switch (rule.type) {
    case 'array': return RuleType.Array
    case 'boolean': return RuleType.Boolean
    case 'integer': case 'number': return RuleType.Number
    case 'null': return RuleType.Null
    case 'object': return RuleType.Object
    case 'string': return RuleType.String
  }
  if (Array.isArray(rule.type)) {
    return RuleType.Union
  }
  if (isNumberLiteral(rule)) {
    return RuleType.Number
  }
  if (!isPlainObject(rule)) {
    return RuleType.Literal
  }
  if (isPlainObject(rule)) {
    return RuleType.AnonymousSchema // TODO: is it safe to do this as a catchall?
  }
  return RuleType.Any
}

function isNumberLiteral(a: any): boolean {
  return /^[\d\.]+$/.test(a)
}

function validateNamedEnum(rule: NamedEnumJSONSchema): void | never {
  if (rule.tsEnumNames.length !== rule.enum.length) {
    throw new TypeError(`Property enum and property tsEnumNames must be the same length: ${JSON.stringify(rule)}`)
  }
  if (rule.tsEnumNames.some(_ => typeof _ !== 'string')) {
    throw TypeError('If tsEnumValue is declared, it must be an array of strings')
  }
}

function isRequired(propertyName: string, schema: JSONSchema): boolean {
  return schema.required ? schema.required.indexOf(propertyName) > -1 : false
}

function supportsAdditionalProperties(schema: JSONSchema): boolean {
  return schema.additionalProperties === true || isPlainObject(schema.additionalProperties)
}
