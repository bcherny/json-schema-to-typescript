import { JSONSchema } from './JSONSchema'
import { format } from './prettyPrinter'
import { TsType } from './TsTypes'
import { readFile, readFileSync } from 'fs'
import { isPlainObject, last, map, merge, uniq, uniqBy, zip } from 'lodash'
import { join, parse, ParsedPath, resolve } from 'path'

enum RuleType {
  'Any', 'TypedArray', 'Enum', 'AllOf', 'AnyOf', 'Reference', 'NamedSchema', 'AnonymousSchema',
  'String', 'Number', 'Void', 'Object', 'Array', 'Boolean', 'Literal', 'Union'
}

enum EnumType {
  String,
  Boolean,
  Integer
}

class Compiler {
  static DEFAULT_SETTINGS = TsType.DEFAULT_SETTINGS

  static DEFAULT_SCHEMA: JSONSchema.Schema = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
  }

  constructor(
    private schema: JSONSchema.Schema,
    filePath: string | undefined = '',
    settings?: TsType.TsTypeSettings
  ) {
    let path = resolve(filePath)
    this.filePath = parse(path)
    this.declarations = new Map
    this.id = schema.id || schema.title || this.filePath.name || 'Interface1'
    this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings)
    this.declareType(this.toTsType(this.schema, '', true), this.id, this.id)
  }

  toString(): string {
    return format(
      Array.from(this.declarations.values())
        .map(_ => _.toDeclaration(this.settings))
        .join('\n')
    )
  }

  private settings: TsType.TsTypeSettings
  private id: string
  private declarations: Map<string, TsType.TsTypeBase>
  private filePath: ParsedPath

  private isRequired(propertyName: string, schema: JSONSchema.Schema): boolean {
    return schema.required ? schema.required.indexOf(propertyName) > -1 : false
  }

  private supportsAdditionalProperties(schema: JSONSchema.Schema): boolean {
    return schema.additionalProperties === true || isPlainObject(schema.additionalProperties)
  }

  private getRuleType(rule: JSONSchema.Schema): RuleType {
    if (rule.type === 'array' && rule.items) {
      return RuleType.TypedArray
    }
    // enum type vs enum constant?
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
      case 'null': return RuleType.Void
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

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  // only called in case of a $ref type
  private resolveType(refPath: string, propName: string): TsType.TsTypeBase {
    if (refPath === '#' || refPath === '#/'){
      return TsType.Interface.reference(this.id)
    }

    if (refPath[0] !== '#'){
      let id: string
      let fullPath = resolve(join(this.filePath.dir, refPath))
      let file: Buffer

      if (fullPath.startsWith('http')) {
        throw new ReferenceError('Remote http references are not yet supported.  Could not read ' + fullPath)
      }

      try {
        file = readFileSync(fullPath)
      } catch (err){
        throw new ReferenceError('Unable to find referenced file ' + fullPath)
      }

      let targetType = this.toTsType(JSON.parse(file.toString()), propName, false, true)
      if (targetType.id){
        id = targetType.toSafeType(this.settings)
      } else {
        let parsedNewFile = parse(fullPath)
        id = parsedNewFile.name
      }

      if (this.settings.declareReferenced){
        this.declareType(targetType, id, id)
      }

      return new TsType.Literal(id)
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
      case 'boolean': return new TsType.Boolean // ts doesn't support literal boolean types
      case 'number': return new TsType.Number   // ts doesn't support literal numeric types
      case 'string': return new TsType.Literal(JSON.stringify(a))
      default: return new TsType.Interface(map(
        (a as any),
        (v: JSONSchema.Schema, k: string) => {
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

  private createTsType (rule: JSONSchema.Schema, propName?: string, isTop: boolean = false, isReference: boolean = false): TsType.TsTypeBase {
    switch (this.getRuleType(rule)) {
      case RuleType.AnonymousSchema:
      case RuleType.NamedSchema:
        return this.toTsDeclaration(rule)
      case RuleType.Enum:
        // we honor the schema's "type" on the enum.  if string, generate a union.
        // if int, require the tsEnumNames
        let enumType = this.validateEnumMembers(rule)

        switch (enumType){
          case EnumType.Integer:
            var enumValues = zip(rule.tsEnumNames || [],
                // If we try to create a literal from an object, bad stuff can happen... so we have to toString it
                rule.enum!.map(_ => new TsType.Literal(_).toType(this.settings).toString()))
              .map(_ => new TsType.EnumValue(_))

            // name our anonymous enum, if it doesn't have an ID, by the property name under
            // which it was declared.  Failing both of these things, it'll concat together the
            // identifiers as EnumOneTwoThree for enum: ["One", "Two", "Three"].  Ugly, but
            // practical.
            let path = rule.id || propName || ('Enum' + enumValues.map(_ => _.identifier).join(''))

            let enm = new TsType.Enum(enumValues)
            let retVal: TsType.TsTypeBase = enm

            // don't add this to the declarations map if this is the top-level type (already declared)
            // or if it's a reference and we don't want to declare those.
            if ((!isReference || this.settings.declareReferenced)){
              if (!isTop){
                retVal = this.declareType(retVal, path, path)
              } else {
                retVal.id = path
              }
            }

            return retVal
          case EnumType.Boolean:
            return new TsType.Union(uniq(rule.enum!.map(_ => this.toTsType(_))))
          case EnumType.String:
            return new TsType.Union(uniqBy(
              rule.enum!.map(_ => this.toStringLiteral(_))
              , _ => _.toType(this.settings)))
        }
      case RuleType.Any: return new TsType.Any
      case RuleType.Literal: return new TsType.Literal(rule)
      case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items!))
      case RuleType.Array: return new TsType.Array
      case RuleType.Boolean: return new TsType.Boolean
      case RuleType.Number: return new TsType.Number
      case RuleType.Object: return new TsType.Object
      case RuleType.String: return new TsType.String
      case RuleType.Void: return new TsType.Void
      case RuleType.AllOf:
        return new TsType.Intersection(rule.allOf!.map(_ => this.toTsType(_)))
      case RuleType.AnyOf:
        return new TsType.Union(rule.anyOf!.map(_ => this.toTsType(_)))
      case RuleType.Reference:
        return this.resolveType(rule.$ref!, propName!)
      case RuleType.Union:
        return new TsType.Union((rule.type as any[]).map(_ => this.toTsType(_)))
    }
    throw new Error('Unknown rule:' + rule.toString())
  }

  private validateEnumMembers(rule: JSONSchema.Schema): EnumType {
    // Note: `candidateTypes` sequence corresponds to `enum EnumType` and integer is intentionally
    // last because in one thrown error message, '(with corresponding tsEnumNames)' is appended
    // and applies to 'integer'
    const candidateTypes: JSONSchema.SimpleTypes[] = ['string', 'boolean', 'integer']
    const getPossibilitiesString = () => candidateTypes.reduce((prev, cand, index, cands) => {
          return `${prev}${index > 0 ?
            (index < cands.length - 1) ? ', ' : ' or ' :
            ''
            }${cand}`
      }, '')

    const isActually = candidateTypes.find(candType => rule.enum!.every(_ =>
      candType === 'integer' ? Number.isInteger(_) : typeof(_) === candType))

    // if undeclared, infer type from isActually
    if (rule.type === undefined && isActually !== undefined) rule.type = isActually

    // First Validation
    if (rule.type === undefined) {
      throw TypeError(`Enum type must be ${getPossibilitiesString()}. It was not declared or could not be inferred by enum values`)
    }

    // Second Validation: rule.type defined, but unknown (includes Object)
    if (candidateTypes.find(candType => rule.type === candType) === undefined) {
      throw TypeError(`Enum type must be ${getPossibilitiesString()}. It was declared as ${rule.type}`)
    }

    // Third Validation: rule type doesn't match the enum members or the members aren't a consistent type
    if (isActually === undefined || rule.type !== isActually) {
      throw TypeError(`Enum was declared as "${rule.type}" type, but found at least one non-${rule.type} member`)
    }

    if (isActually === 'integer') {
      // Fourth Validation
      if (!rule.tsEnumNames) {
        throw TypeError('Property tsEnumNames is required when enum is declared as an integer type')
      }
      // Fifth Validation
      if (rule.tsEnumNames.length !== rule.enum!.length) {
        throw TypeError('Property enum and property tsEnumNames must be the same length')
      }

      // Sixth Validation
      if (rule.tsEnumNames!.some(_ => typeof(_) !== 'string')) {
        throw TypeError('Enum was declared as "integer" type, but found at least one non-string tsEnumValue')
      }
    }

    // I don't think we should ever hit this case.
    if (isActually === undefined){
      throw TypeError(`Enum members must be a list of ${getPossibilitiesString()} (with corresponding tsEnumNames)`)
    }

    if (rule.type === 'string') return EnumType.String
    if (rule.type === 'boolean') return EnumType.Boolean
    return EnumType.Integer // this is the only remaining possibility. An error would have been thrown otherwise.
  }

  private toTsType (rule: JSONSchema.Schema, propName?: string, isTop: boolean = false, isReference: boolean = false): TsType.TsTypeBase {
    let type = this.createTsType(rule, propName, isTop, isReference)
    if (!type.id) {
      // the type is not declared, let's check if we should declare it or keep it inline
      type.id = rule.id || rule.title
      if (type.id && !isReference)
        this.declareType(type, type.id, type.id)
    }
    type.description = type.description || rule.description
    return type
  }
  private toTsDeclaration(schema: JSONSchema.Schema): TsType.TsTypeBase {
    let copy = merge({}, Compiler.DEFAULT_SCHEMA, schema)
    let props = map(
      copy.properties!,
      (v: JSONSchema.Schema, k: string) => {
        return {
          name: k,
          required: this.isRequired(k, copy),
          type: this.toTsType(v, k)
        }
      })
    if (props.length === 0 && !('additionalProperties' in schema)) {
      if ('default' in schema)
        return new TsType.Void
    }
    if (this.supportsAdditionalProperties(copy)) {
      let short = copy.additionalProperties === true
      if (short && props.length === 0)
        return new TsType.Any
      let type = short ? new TsType.Any : this.toTsType(copy.additionalProperties as JSONSchema.Schema)
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
  schema: JSONSchema.Schema,
  path: string | undefined,
  settings?: TsType.TsTypeSettings
): string {
  return new Compiler(schema, path, settings).toString()
}

export function compileFromFile(inputFilename: string): Promise<string | Error> {
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
