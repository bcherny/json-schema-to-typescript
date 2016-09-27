import { EnumJSONSchema, JSONSchema, NamedEnumJSONSchema } from './JSONSchema'
import { TsType } from './TsTypes'
import { readFile, readFileSync } from 'fs'
import { isPlainObject, last } from 'lodash'
import { join, parse, ParsedPath, resolve } from 'path'

// Inspired from http://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function#answer-10284006
const zip = (...args: any[]) => args[0].map((_: any, index: number) => args.map(row => row[index]))

// This ITypeBaseOrTrampFunc is used for Tail Call Optimization using a trampoline
type ITypeBaseOrTrampFunc = TsType.TsTypeBase | ((schema: JSONSchema) => ITypeBaseOrTrampFunc)

enum RuleType {
  Any, TypedArray, Enum, AllOf, AnyOf, Reference, NamedSchema, AnonymousSchema,
  String, Number, Null, Object, Array, Boolean, Literal, NamedEnum, Union
}

enum EnumType { Boolean, Number, String }

class Compiler {
  static DEFAULT_SETTINGS = TsType.DEFAULT_SETTINGS

  static DEFAULT_SCHEMA: JSONSchema = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
  }

  constructor(
    private schema: JSONSchema,
    filePath: string | undefined = '',
    settings?: TsType.TsTypeSettings
  ) {
    let path = resolve(filePath)
    this.filePath = parse(path)
    this.declarations = new Map
    this.namedEnums = new Map
    this.id = schema.id || schema.title || this.filePath.name || 'Interface1'
    this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings)
    this.declareType(this.toTsType(this.schema, '', true), this.id, this.id)
  }

  toString(): string {
    return  [
        ...Array.from(this.namedEnums.values()),
        ...Array.from(this.declarations.values())
      ]
      .map(_ => _.toDeclaration(this.settings))
      .join('\n')

  }

  private settings: TsType.TsTypeSettings
  private id: string
  private declarations: Map<string, TsType.TsTypeBase>
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

  private resolveRefFromLocalFS(refPath: string, propName: string): TsType.TsTypeBase {
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
    const targetType = this.toTsType(contents, propName, false, true)
    const id = targetType.id
      ? targetType.toSafeType(this.settings)
      : parse(fullPath).name

    if (this.settings.declareReferenced) {
      this.declareType(targetType, id, id)
    }

    return new TsType.Reference(id)
  }

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  // only called in case of a $ref type
  private resolveRef(refPath: string, propName: string): TsType.TsTypeBase {
    if (refPath === '#' || refPath === '#/'){
      return TsType.Interface.reference(this.id)
    }

    if (refPath[0] !== '#'){
      return this.resolveRefFromLocalFS(refPath, propName)
    }

    const parts = refPath.slice(2).split('/')
    let ret = this.settings.declareReferenced ? this.declarations.get(parts.join('/')) : undefined

    if (!ret) {
      let cur: any = this.schema
      for (let i = 0; cur && i < parts.length; ++i) {
        cur = cur[parts[i]]
      }
      ret = this.toTsType(cur)
      if (this.settings.declareReferenced && (this.settings.declareSimpleType || !ret.isSimpleType()))
        this.declareType(ret, parts.join('/'), this.settings.useFullReferencePathAsName ? parts.join('/') : last(parts))
    }
    return ret
  }

  private declareType(type: TsType.TsTypeBase, refPath: string, id: string) {
    type.id = id
    this.declarations.set(refPath, type)
    return type
  }

  private toStringLiteral(a: boolean | number | string | Object): TsType.TsTypeBase {
    switch (typeof a) {
      case 'boolean':
      case 'number':
      case 'string':
        return new TsType.Literal(a)
      default: return new TsType.Interface(Object.keys(a).map(k => {
          var v = (a as any)[k]
          return {
            name: k,
            required: true,
            type: this.toStringLiteral(v)
          }
        }))
      // TODO: support array types?
      // TODO: support enums of enums
      // TODO: support nulls
    }
  }

  private generateEnumName(rule: JSONSchema, propName: string | undefined): string {
    return rule.id || propName || `Enum${this.namedEnums.size}`
  }

  private generateTsType (rule: JSONSchema, propName?: string, isTop: boolean = false, isReference: boolean = false): ITypeBaseOrTrampFunc {
    switch (this.getRuleType(rule)) {
      case RuleType.AnonymousSchema:
      case RuleType.NamedSchema:
        return this.toTsDeclaration

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
          ).map((_: any) => new TsType.EnumValue(_))
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

  private toTsType(
    rule: JSONSchema,
    propName?: string,
    isTop: boolean = false,
    isReference: boolean = false
  ): TsType.TsTypeBase {
    var type = this.generateTsType(rule, propName, isTop, isReference)
    while (typeof type === 'function') type = type.call(this, rule) // type === toTsDeclaration
    if (!type.id) {
      // the type is not declared, let's check if we should declare it or keep it inline
      type.id = rule.id || rule.title as string // TODO: fix types
      if (type.id && !isReference)
        this.declareType(type, type.id, type.id)
    }
    type.description = type.description || rule.description
    return type
  }
  private toTsDeclaration(schema: JSONSchema): TsType.TsTypeBase {
    // Notes:
    // * `copy` is only read. To be absolutely sure it is frozen.
    // * As well, there is no need for lodash merge which uses deep clone.
    // * Below `this.toTsType()` is called with `copy.additionalProperties`,
    //   which may lead back to `this.toTsDeclaration`, in which case another
    //   shallow clone will occur.
    // * Using Object.assign() rather than Object.create() because schema is a POJO (so
    //   we shouldn't need to copy property definitions) and the copy will be frozen.
    const copy: JSONSchema = Object.freeze(Object.assign({}, Compiler.DEFAULT_SCHEMA, schema))
    const props = copy.properties === undefined ? [] : Object.keys(copy.properties).map(k => {
      // Asserting copy.properties[k] is always defined here because Object.keys() wouldn't
      // emit a key if it was undefined.  Note: In future Object.entries() should be used.
      var v = copy.properties![k]
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
      // TODO: Can recursive call to this.toTsType() be minimized or eliminated with 
      // trampolining or other approach?
      const type = short ? new TsType.Any : this.toTsType(copy.additionalProperties as JSONSchema)
      props.push({
        name: '[k: string]',
        required: true,
        type: type
      })
    }
    return new TsType.Interface(props)
  }
}

export function compile(
  schema: JSONSchema,
  path: string | undefined,
  settings?: TsType.TsTypeSettings
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
