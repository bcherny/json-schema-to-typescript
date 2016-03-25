import {camelCase, last, map, merge, upperFirst} from 'lodash'
import {readFile} from 'fs'
import * as tsfmt from 'typescript-formatter'
import {Readable} from 'stream'
import {format} from './pretty-printer'

interface Rule {
  $ref?: string
  description?: string
  enum?: Type[]
  items?: {
    type: Type
  }
  minimum?: number
  minItems?: number
  oneOf?: Rule[]
  type: Type
  uniqueItems?: boolean
  [a: string]: Object
}

type Type = "array"|"boolean"|"integer"|"null"|"number"|"object"|"string"
type JSONSchemaType = "array"|"object"

interface JSONSchema {
  additionalProperties?: boolean
  description?: string
  properties: {
    [a: string]: Rule
  }
  required?: string[]
  title?: string
  type: JSONSchemaType
}

enum RuleType {"TypedArray","Enum","Default","OneOf","Reference","Schema"}

class Compiler {

  static DEFAULT_SCHEMA: JSONSchema = {
    properties: {},
    required: [],
    type: 'object'
  }

  static JSON_SCHEMA_TO_TYPE_MAP: {[a: string]: string} = {
    array: 'array',
    boolean: 'boolean',
    integer: 'number',
    number: 'number',
    null: 'void',
    object: 'Object',
    string: 'string'
  }

  constructor(private schema: JSONSchema) {}

  private state = {
    interfaces: []
  }

  private isRequired(propertyName: string, schema: JSONSchema): boolean {
    return schema.required.indexOf(propertyName) > -1
  }

  private supportsAdditionalProperties(schema: JSONSchema): boolean {
    return !(schema.additionalProperties === false)
  }

  private toInterfaceName (a: string): string {
    return upperFirst(camelCase(a))
  }

  private getRuleType (rule: Rule): RuleType {
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
    return RuleType.Default
  }

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  private parsePath (path: string): string[] {
    return (path.slice(0, 2) === '#/' ? path.slice(2) : path).split('/')
  }

  private getReference(path: string[], root: Object): Rule {
    switch (path.length) {
      case 0: throw ReferenceError(`$ref "#{path.join('/')}" points at invalid reference`)
      case 1: return root[path[0]]
      default: return this.getReference(path.slice(1), root[path[0]])
    }
  }

  private getInterface (name: string) {
    return this.state.interfaces.find(_ => _.name === this.toInterfaceName(name))
  }

  private generateTypeString (rule: Rule, root: JSONSchema, name?: string): string {
    let def, path
    switch (this.getRuleType(rule)) {
      case RuleType.Schema:
        def = this.getInterface(name)
        if (def) {
          return name
        } else {
          this.state.interfaces.push(
            this.generateInterface(rule, name)
          )
        }
        return name
      case RuleType.Default: return Compiler.JSON_SCHEMA_TO_TYPE_MAP[rule.type]
      case RuleType.Enum: return rule.enum.map(_ => `"${_}"`).join('|')
      case RuleType.TypedArray: return `${Compiler.JSON_SCHEMA_TO_TYPE_MAP[rule.items.type]}[]`
      case RuleType.OneOf:
        return rule.oneOf.map(_ => {
          const path = this.parsePath(_.$ref)
          return this.toInterfaceName(this.generateTypeString(_, root, last(path)))
        }).join('|')
      case RuleType.Reference:
        path = this.parsePath(rule.$ref)
        def = this.getInterface(last(path))
        if (def) {
          return def.name
        } else {
          return this.generateTypeString(this.getReference(path, root), root, last(path))
        }
    }
  }
  private generateInterface (schema: JSONSchema, title?: string): {name: string, code: string} {
    schema = merge({}, Compiler.DEFAULT_SCHEMA, schema)
    const props = map(schema.properties, (v: Rule, k: string) =>
      `${k}${this.isRequired(k, schema) ? '' : '?'}: ${this.generateTypeString(v, schema)};`
      + (v.description ? ` // ${v.description}` : '')
    )
    if (this.supportsAdditionalProperties(schema)) {
      // TODO: dynamically generate key name to avoid collisions
      props.push('[k: string]: any;')
    }

    const parts: string[] = []
    if (schema.description) {
      parts.push(`/*
    ${schema.description}
  */`)
    }

    const name = this.toInterfaceName(title || schema.title)
    parts.push(`interface ${name} {
      ${props.join('\n')}
    }`)

    return {
      name,
      code: parts.join('\n')
    }
  }
  toString(): string {
    const a = this.generateInterface(this.schema)
    this.state.interfaces.push(a)
    return format(this.state.interfaces.map(_ => _.code).join('\n'))
  }
}

export function compile(schema: JSONSchema): string {
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