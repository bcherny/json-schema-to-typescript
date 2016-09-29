import { EnumJSONSchema, JSONSchema, NamedEnumJSONSchema } from './JSONSchema'
import * as TsType from './TsTypes'
import { readFile, readFileSync } from 'fs'
import { get, isPlainObject, last, map, merge, zip } from 'lodash'
import { join, parse, ParsedPath, resolve } from 'path'

enum RuleType {
  Any, TypedArray, Enum, AllOf, AnyOf, Reference, NamedSchema, AnonymousSchema,
  String, Number, Null, Object, Array, Boolean, Literal, NamedEnum, Union
}

enum EnumType { Boolean, Number, String }

export interface Settings {
  declareReferenced?: boolean
  endPropertyWithSemicolon?: boolean
  endTypeWithSemicolon?: boolean
  useConstEnums?: boolean
  useFullReferencePathAsName?: boolean
}

class Compiler {

  static DEFAULT_SETTINGS: Settings = {
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
    this.filePath = parse(resolve(filePath))
    this.declarations = new Map
    this.namedEnums = new Map
    this.id = schema.id || schema.title || this.filePath.name || 'Interface1'
    this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings)
    this.declareType(this.toTsType(this.schema, '', true) as TsType.Interface, this.id, this.id)
  }

  toString(): string {
    return  [
        ...Array.from(this.namedEnums.values()),
        ...Array.from(this.declarations.values())
      ]
      .map(_ => _.toDeclaration(this.settings))
      .join('\n')

  }

  private settings: Settings
  private id: string
  private declarations: Map<string, TsType.TsType<any>>
  private namedEnums: Map<string, TsType.Enum>
  private filePath: ParsedPath

  private isRequired(propertyName: string, schema: JSONSchema): boolean {
    return schema.required ? schema.required.indexOf(propertyName) > -1 : false
  }

  private supportsAdditionalProperties(schema: JSONSchema): boolean {
    return schema.additionalProperties === true || isPlainObject(schema.additionalProperties)
  }

  private getRuleType(rule: JSONSchema): RuleType {

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
    if (this.isNumberLiteral(rule)) {
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

  private isNumberLiteral(a: any): boolean {
    return /^[\d\.]+$/.test(a)
  }

  private resolveRefFromLocalFS<T>(refPath: string, propName: string): TsType.Reference {
    const fullPath = resolve(join(this.filePath.dir, refPath))

    if (fullPath.startsWith('http')) {
      throw new ReferenceError('Remote http references are not yet supported.  Could not read ' + fullPath)
    }

    const file = tryFn(
      () => readFileSync(fullPath),
      () => { throw new ReferenceError(`Unable to find referenced file "${fullPath}"`) }
    )
    const contents = tryFn(
      () => JSON.parse(file.toString()),
      () => { throw new TypeError(`Referenced local schema "${fullPath}" contains malformed JSON`) }
    )
    const targetType = this.toTsType(contents, propName, true)
    const id = targetType.id
      ? targetType.toType(this.settings)
      : parse(fullPath).name

    if (this.settings.declareReferenced) {
      this.declareType(targetType as TsType.Interface, id, id)
    }

    return new TsType.Reference(id)
  }

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  // only called in case of a $ref type
  private resolveRef(refPath: string, propName: string): TsType.TsType<any> {
    if (refPath === '#' || refPath === '#/'){
      return TsType.Interface.reference(this.id)
    }

    if (refPath[0] !== '#'){
      return this.resolveRefFromLocalFS(refPath, propName)
    }

    const parts = refPath.slice(2).split('/')
    const existingRef = this.declarations.get(parts.join('/'))

    // resolve existing declaration?
    if (existingRef) {
      return existingRef
    }

    // resolve from elsewhere in the schema
    const type = this.toTsType(get(this.schema, parts.join('.')))
    if (this.settings.declareReferenced || !type.isSimpleType()) {
      this.declareType(type as TsType.Interface, parts.join('/'), this.settings.useFullReferencePathAsName ? parts.join('/') : last(parts))
    }
    return type
  }

  private declareType(type: TsType.Interface, refPath: string, id: string) {
    type.id = id
    this.declarations.set(refPath, type)
    return type
  }

  private generateEnumName(rule: JSONSchema, propName: string | undefined): string {
    return rule.id || propName || `Enum${this.namedEnums.size}`
  }

  private generateTsType (rule: JSONSchema, propName?: string, isReference: boolean = false): TsType.TsType<any> {
    switch (this.getRuleType(rule)) {
      case RuleType.AnonymousSchema:
      case RuleType.NamedSchema:
        return this.toTsDeclaration(rule)

      case RuleType.Enum:
        return new TsType.Union(
          (rule as EnumJSONSchema).enum.map(_ => new TsType.Literal(_))
        )

      case RuleType.NamedEnum:
        Compiler.validateNamedEnum(rule as NamedEnumJSONSchema)

        const name = this.generateEnumName(rule, propName)
        const tsEnum = new TsType.Enum(name,
          zip(
            (rule as NamedEnumJSONSchema).tsEnumNames,
            (rule as NamedEnumJSONSchema).enum
          ).map(_ => new TsType.EnumValue(_))
        )
        this.namedEnums.set(name, tsEnum)
        return tsEnum

      case RuleType.Any: return new TsType.Any
      case RuleType.Literal: return new TsType.Literal(rule)
      case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items!))
      case RuleType.Array: return new TsType.Array
      case RuleType.Boolean: return new TsType.Boolean
      case RuleType.Null: return new TsType.Null
      case RuleType.Number: return new TsType.Number
      case RuleType.Object: return new TsType.Object
      case RuleType.String: return new TsType.String
      case RuleType.AllOf:
        return new TsType.Intersection(rule.allOf!.map(_ => this.toTsType(_)))
      case RuleType.AnyOf:
        return new TsType.Union(rule.anyOf!.map(_ => this.toTsType(_)))
      case RuleType.Reference:
        return this.resolveRef(rule.$ref!, propName!)
      case RuleType.Union:
        return new TsType.Union((rule.type as any[]).map(_ => this.toTsType({ type: _ })))
    }
    throw new Error('Unknown rule:' + rule.toString())
  }

  private static validateNamedEnum(rule: NamedEnumJSONSchema): void | never {
    if (rule.tsEnumNames.length !== rule.enum.length) {
      throw new TypeError(`Property enum and property tsEnumNames must be the same length: ${JSON.stringify(rule)}`)
    }
    if (rule.tsEnumNames.some(_ => typeof _ !== 'string')) {
      throw TypeError('If tsEnumValue is declared, it must be an array of strings')
    }
  }

  private toTsType<T>(
    rule: JSONSchema,
    propName?: string,
    isReference: boolean = false
  ): TsType.TsType<T> {
    const type = this.generateTsType(rule, propName, isReference)
    if (!type.id) {
      // the type is not declared, let's check if we should declare it or keep it inline
      type.id = rule.id || rule.title as string // TODO: fix types
      if (type.id && !isReference)
        this.declareType(type, type.id, type.id)
    }
    type.description = type.description || rule.description
    return type
  }
  private toTsDeclaration(schema: JSONSchema): TsType.Interface | TsType.Null {
    const copy = merge({}, Compiler.DEFAULT_SCHEMA, schema)
    const props = map(
      copy.properties!,
      (v: JSONSchema, k: string) => {
        return {
          name: k,
          required: this.isRequired(k, copy),
          type: this.toTsType(v, k)
        }
      })
    if (props.length === 0 && !('additionalProperties' in schema)) {
      if ('default' in schema)
        return new TsType.Null
    }
    if (this.supportsAdditionalProperties(copy)) {
      const short = copy.additionalProperties === true
      if (short && props.length === 0)
        return new TsType.Any
      const type = short ? new TsType.Any : this.toTsType(copy.additionalProperties as JSONSchema)
      props.push({
        name: '[k: string]',
        required: true,
        type
      } as any) // TODO: fix type
    }
    return new TsType.Interface(props)
  }
}

export function compile(
  schema: JSONSchema,
  path: string | undefined,
  settings?: Settings
): string {
  return new Compiler(schema, path, settings).toString()
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

// TODO: pull out into a separate package
function tryFn<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}
