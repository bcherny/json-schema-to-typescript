import {camelCase, isPlainObject, last, map, merge, upperFirst} from 'lodash'
import {readFile} from 'fs'
import * as tsfmt from 'typescript-formatter'
import {Readable} from 'stream'
import {format} from './pretty-printer'
import * as TsType from './TsTypes'

enum RuleType {"TypedArray","Enum","AllOf","AnyOf","Reference","Schema",
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
    if (!isPlainObject(rule)) {
      return RuleType.Literal
    }
    if (rule.type === 'array' && rule.items && rule.items.type) {
      return RuleType.TypedArray
    }
    if (rule.enum) {
      return RuleType.Enum
    }
    if (rule.properties || rule.additionalProperties) {
      return RuleType.Schema
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
    return RuleType.Literal // TODO: is it safe to do this as a catchall?
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

  private toStringLiteral(a: boolean|number|string|Object): string {
    switch (typeof a) {
      case 'boolean': return a ? 'true' : 'false'
      case 'number': return String(a)
      case 'string': return `"${a}"`
      default: return JSON.stringify(a)
    }
  }

  private toTsType (rule: JSONSchema.Schema, root: JSONSchema.Schema, name?: string): TsType.TsType {
    switch (this.getRuleType(rule)) {
      case RuleType.Schema:
        return new TsType.Class(
          this.createInterfaceNx(rule, name).name
        )
      case RuleType.Enum:
        return new TsType.Union(rule.enum.map(_ =>
          this.toTsType(this.toStringLiteral(_), root)
        ))
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
  private toTsInterface (schema: JSONSchema.Schema, title?: string): TsType.Interface {
    schema = merge({}, Compiler.DEFAULT_SCHEMA, schema)

    const props: TsType.InterfaceProperty[] = map(
      schema.properties,
      (v: JSONSchema.Schema, k: string) => new TsType.InterfaceProperty({
        isRequired: this.isRequired(k, schema),
        key: k,
        value: this.toTsType(v, schema),
        description: v.description
      })
    )

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