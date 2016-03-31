import {camelCase, isPlainObject, last, map, merge, uniqBy, upperFirst} from 'lodash'
import {readFile} from 'fs'
import {Readable} from 'stream'
import {format} from './pretty-printer'
import * as TsType from './TsTypes'

enum RuleType {"Any","TypedArray","Enum","AllOf","AnyOf","Reference","NamedSchema", "AnonymousSchema",
  "String","Number","Void","Object","Array","Boolean","Literal"}

class Compiler {

  static DEFAULT_SCHEMA: JSONSchema.Schema = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
  }

  constructor(private schema: JSONSchema.Schema) {}

  toString(): string {
    return format(
      this.state.interfaces
        .concat(this.toTsInterface(this.schema))
        .map(_ => _.toString())
        .join('\n')
    )
  }

  private state: {
    interfaces: TsType.Interface[],
    anonymousSchemaNameGenerator: IterableIterator<string>
  } = {
    interfaces: [],
    anonymousSchemaNameGenerator: this.generateSchemaName()
  }

  private *generateSchemaName(): IterableIterator<string> {
    let counter = 0
    while (++counter) {
      yield `Interface${counter}`
    }
  }

  private isRequired(propertyName: string, schema: JSONSchema.Schema): boolean {
    return schema.required.indexOf(propertyName) > -1
  }

  private supportsAdditionalProperties(schema: JSONSchema.Schema): boolean {
    return schema.additionalProperties === true || isPlainObject(schema.additionalProperties)
  }

  private toInterfaceName (a: string): string {
    return upperFirst(camelCase(a))     
        || this.state.anonymousSchemaNameGenerator.next().value
  }

  private getRuleType (rule: JSONSchema.Schema): RuleType {
    if (rule.type === 'array' && rule.items && rule.items.type) {
      return RuleType.TypedArray
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
      case 'null': return RuleType.Void
      case 'object': return RuleType.Object
      case 'string': return RuleType.String
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

  private isNumberLiteral (a: any): boolean {
    return /^[\d\.]+$/.test(a)
  }

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  private parsePath (path: string): string[] {
    return (path.slice(0, 2) === '#/' ? path.slice(2) : path).split('/')
  }

  private getReference(path: string[], root: JSONSchema.Schema): JSONSchema.Schema {
    switch (path.length) {
      case 0: throw ReferenceError(`$ref "#{path.join('/')}" points at invalid reference`)
      case 1: return root[path[0]]
      default: return this.getReference(path.slice(1), root[path[0]])
    }
  }

  private getInterface (name: string): TsType.Interface {
    return this.state.interfaces.find(_ => _.name === this.toInterfaceName(name))
  }

  private createInterfaceNx (rule: JSONSchema.Schema, name: string): TsType.Interface {
    return this.getInterface(name) || (() => {
      const a = this.toTsInterface(rule, name)
      this.state.interfaces.push(a)
      return a
    })()
  }

  private toStringLiteral(a: boolean|number|string|Object): string|Object {
    switch (typeof a) {
      case 'boolean': return 'boolean' // ts doesn't support literal boolean types
      case 'number': return 'number'   // ts doesn't support literal numeric types
      case 'string': return `"${a}"`
      default: return a
      // TODO: support array types?
      // TODO: support enums of enums
      // TODO: support nulls
    }
  }

  private toTsType (rule: JSONSchema.Schema, root: JSONSchema.Schema, name?: string): TsType.TsType {
    switch (this.getRuleType(rule)) {
      case RuleType.AnonymousSchema:
        return new TsType.AnonymousInterface(
          this.schemaPropsToInterfaceProps(merge({}, Compiler.DEFAULT_SCHEMA, {
            required: Object.keys(rule),
            properties: rule
          }))
        )
      case RuleType.NamedSchema:
        return new TsType.NamedClass(
          this.createInterfaceNx(rule, name).name
        )
      case RuleType.Enum:
        return new TsType.Union(uniqBy(
          rule.enum.map(_ =>
            this.toTsType(this.toStringLiteral(_), root)
          )
          , _ => _.toString())
        )
      case RuleType.Any: return new TsType.Any
      case RuleType.Literal: return new TsType.Literal(rule)
      case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items, root))
      case RuleType.Array: return new TsType.Array
      case RuleType.Boolean: return new TsType.Boolean
      case RuleType.Number: return new TsType.Number
      case RuleType.Object: return new TsType.Object
      case RuleType.String: return new TsType.String
      case RuleType.Void: return new TsType.Void
      case RuleType.AllOf:
        return new TsType.Intersection(rule.allOf.map(_ => {
          const path = this.parsePath(_.$ref)
          return this.toTsType(_, root, last(path))
        }))
      case RuleType.AnyOf:
        return new TsType.Union(rule.anyOf.map(_ => {
          const path = this.parsePath(_.$ref)
          return this.toTsType(_, root, last(path))
        }))
      case RuleType.Reference:
        const path = this.parsePath(rule.$ref)
        const int = this.getInterface(last(path))
        return int
          ? new TsType.Literal(int.name)
          : this.toTsType(this.getReference(path, root), root, last(path))
    }
  }
  private schemaPropsToInterfaceProps (schema: JSONSchema.Schema): TsType.InterfaceProperty[] {
    return map(
      schema.properties,
      (v: JSONSchema.Schema, k: string) => new TsType.InterfaceProperty({
        isRequired: this.isRequired(k, schema),
        key: k,
        value: this.toTsType(v, schema),
        description: v.description
      })
    )
  }
  private toTsInterface (schema: JSONSchema.Schema, title?: string): TsType.Interface {
    schema = merge({}, Compiler.DEFAULT_SCHEMA, schema)

    const props = this.schemaPropsToInterfaceProps(schema)

    if (this.supportsAdditionalProperties(schema)) {
      props.push(new TsType.InterfaceProperty({
        key: '[k: string]',
        isRequired: true,
        value: (
          schema.additionalProperties === true
          ? new TsType.Any
          : this.toTsType(<JSONSchema.Schema>schema.additionalProperties, schema)
        )
      }))
    }

    return new TsType.Interface({
      name: this.toInterfaceName(title || schema.title),
      description: schema.description,
      props
    })
  }
}

export function compile(schema: JSONSchema.Schema): string {
  return new Compiler(schema).toString()
}

export function compileFromFile(inputFilename: string): Promise<string|Error> {
  return new Promise((resolve, reject) =>
    readFile(inputFilename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(compile(JSON.parse(data.toString())))
      }
    })
  )
}