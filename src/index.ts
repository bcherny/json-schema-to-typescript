import {camelCase, last, map, merge, upperFirst} from 'lodash'
import {readFile} from 'fs'
import * as tsfmt from 'typescript-formatter'
import {Readable} from 'stream'
import {format} from './pretty-printer'

enum RuleType {"TypedArray","Enum","OneOf","Reference","Schema","String","Number","Void","Object","Array","Boolean","Literal"}

interface TsType {
  toString(): string
}
namespace TsType {
  export class Any implements TsType {
    constructor() {}
    toString() {
      return 'any'
    }
  }
  export class Array implements TsType {
    constructor(private type?: TsType) {}
    toString() {
      return `${this.type ? this.type.toString() : (new TsType.Any()).toString()}[]`
    }
  }
  export class Boolean implements TsType {
    constructor() {}
    toString() {
      return 'boolean'
    }
  }
  export class Class implements TsType {
    constructor(private name: string) {}
    toString() {
      return this.name
    }
  }
  export class Literal implements TsType {
    constructor(private value: any) {}
    toString() {
      return `"${this.value}"` // TODO: support Number, Boolean, Array, and Object literals
    }
  }
  export class Number implements TsType {
    constructor() {}
    toString() {
      return 'number'
    }
  }
  export class Object implements TsType {
    constructor() {}
    toString() {
      return 'Object'
    }
  }
  export class String implements TsType {
    constructor() {}
    toString() {
      return 'string'
    }
  }
  export class Union implements TsType {
    constructor(private data: TsType[]) {}
    toString() {
      return this.data.join('|')
    }
  }
  export class Void implements TsType {
    constructor() {}
    toString() {
      return 'void'
    }
  }
}

interface CompilerState {
  interfaces: Interface[]
}

class Compiler {

  static DEFAULT_SCHEMA: JSONSchema.Schema = {
    properties: {},
    required: [],
    type: 'object'
  }

  constructor(private schema: JSONSchema.Schema) {}

  private state: CompilerState = {
    interfaces: []
  }

  private isRequired(propertyName: string, schema: JSONSchema.Schema): boolean {
    return schema.required.indexOf(propertyName) > -1
  }

  private supportsAdditionalProperties(schema: JSONSchema.Schema): boolean {
    return !(schema.additionalProperties === false)
  }

  private toInterfaceName (a: string): string {
    return upperFirst(camelCase(a))
  }

  private getRuleType (rule: JSONSchema.Rule): RuleType {
    if (rule.type === 'array' && rule.items && rule.items.type) {
      return RuleType.TypedArray
    }
    if (rule.enum) {
      return RuleType.Enum
    }
    if (rule.properties) {
      return RuleType.Schema
    }
    if (rule.oneOf) {
      return RuleType.OneOf
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

  private getReference(path: string[], root: Object): JSONSchema.Rule {
    switch (path.length) {
      case 0: throw ReferenceError(`$ref "#{path.join('/')}" points at invalid reference`)
      case 1: return root[path[0]]
      default: return this.getReference(path.slice(1), root[path[0]])
    }
  }

  private getInterface (name: string) {
    return this.state.interfaces.find(_ => _.name === this.toInterfaceName(name))
  }

  private toTsType (rule: JSONSchema.Rule, root: JSONSchema.Schema, name?: string): TsType {
    let def, path
    switch (this.getRuleType(rule)) {
      case RuleType.Schema:
        def = this.getInterface(name)
        if (def) {
          return new TsType.Class(def.name)
        } else {
          def = this.generateInterface(rule, name)
          this.state.interfaces.push(def)
          return new TsType.Class(def.name)
        }
      case RuleType.Enum: return new TsType.Union(rule.enum.map(_ => this.toTsType(_, root)))
      case RuleType.Literal: return new TsType.Literal(rule)
      case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items, root))
      case RuleType.Array: return new TsType.Array
      case RuleType.Boolean: return new TsType.Boolean
      case RuleType.Number: return new TsType.Number
      case RuleType.Object: return new TsType.Object
      case RuleType.String: return new TsType.String
      case RuleType.Void: return new TsType.Void
      case RuleType.OneOf:
        return new TsType.Union(rule.oneOf.map(_ => {
          const path = this.parsePath(_.$ref)
          return this.toTsType(_, root, last(path))
        }))
      case RuleType.Reference:
        path = this.parsePath(rule.$ref)
        def = this.getInterface(last(path))
        if (def) {
          return def.name
        } else {
          return this.toTsType(this.getReference(path, root), root, last(path))
        }
    }
  }
  private generateInterface (schema: JSONSchema.Schema, title?: string): Interface {
    schema = merge({}, Compiler.DEFAULT_SCHEMA, schema)

    const props: Property[] = map(schema.properties, (v: JSONSchema.Rule, k: string) => new Property({
      isRequired: this.isRequired(k, schema),
      key: k,
      value: this.toTsType(v, schema),
      description: v.description
    }))

    if (this.supportsAdditionalProperties(schema)) {
      props.push(new Property({
        key: '[k: string]',
        isRequired: true,
        value: new TsType.Any
      }))
    }

    return new Interface({
      name: this.toInterfaceName(title || schema.title),
      description: schema.description,
      props
    })
  }
  toString(): string {
    return format(
      this.state.interfaces
        .concat(this.generateInterface(this.schema))
        .map(_ => _.toString())
        .join('\n')
    )
  }
}

class Property {
  constructor(private data: {
    isRequired: boolean,
    key: string,
    value: TsType,
    description?: string
  }) {}
  toString(): string {
    return [
      this.data.key,
      `${this.data.isRequired ? '' : '?'}: `,
      `${this.data.value.toString()};`,
      this.data.description ? ` // ${this.data.description}` : ''
    ].join('')
  }
}

class Interface {
  constructor(private data: {name: string, description?: string, props: Property[]}) {}
  get name (){ return this.data.name }
  private toBlockComment(a: string) {
    return `/*
    ${a}
  */
    `
  }
  toString(): string {
    return `${
        this.data.description
        ? this.toBlockComment(this.data.description)
        : ''
      }interface ${this.data.name} {
        ${this.data.props.join('\n')}
      }`
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

function streamFromString (string: string): Readable {
  var s = new Readable()
  s._read = function noop() {}
  s.push(string)
  s.push(null)
  return s
}