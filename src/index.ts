import {camelCase, map, merge, upperFirst} from 'lodash'
import {readFile} from 'fs'
import * as tsfmt from 'typescript-formatter'
import {Readable} from 'stream'
import {format} from './pretty-printer'

interface RefType {
  $ref: string
}

interface Rule {
  description?: string
  enum?: Type[]
  items?: {
    type: Type
  }
  minimum?: number
  minItems?: number
  oneOf?: RefType[]
  type: Type
  uniqueItems?: boolean
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

const JSONSchemaToTsTypeMap: {[a: string]: string} = {
  array: 'array',
  boolean: 'boolean',
  integer: 'number',
  number: 'number',
  null: 'void',
  object: 'Object',
  string: 'string'
}

const DEFAULT_SCHEMA: JSONSchema = {
  properties: {},
  required: [],
  type: 'object'
}

function isRequired(propertyName: string, schema: JSONSchema): boolean {
  return schema.required.indexOf(propertyName) > -1
}

function supportsAdditionalProperties(schema: JSONSchema): boolean {
  return !(schema.additionalProperties === false)
}

function toInterfaceName (a: string): string {
  return upperFirst(camelCase(a))
}

enum RuleType {"TypedArray","Enum","Default"}

function getRuleType (rule: Rule): RuleType {
  if (rule.type === 'array' && rule.items && rule.items.type) {
    return RuleType.TypedArray
  } else if (rule.enum) {
    return RuleType.Enum
  } else {
    return RuleType.Default
  }
}

function generateTypeString (rule: Rule): string {
  switch (getRuleType(rule)) {
    case RuleType.Default: return JSONSchemaToTsTypeMap[rule.type]
    case RuleType.Enum: return rule.enum.map(_ => `"${_}"`).join('|')
    case RuleType.TypedArray: return `${JSONSchemaToTsTypeMap[rule.items.type]}[]`
  }
}

export function compile(schema: JSONSchema): string {

  schema = merge({}, DEFAULT_SCHEMA, schema)

  const props = map(schema.properties, (v: Rule, k: string) =>
    `${k}${isRequired(k, schema) ? '' : '?'}: ${generateTypeString(v)};`
    + (v.description ? ` // ${v.description}` : '')
  )
  if (supportsAdditionalProperties(schema)) {
    props.push('[a: string]: any;')
  }

  const parts: string[] = []
  if (schema.description) {
    parts.push(`/*
  ${schema.description}
*/`)
  }
  parts.push(`
    interface ${toInterfaceName(schema.title)} {
      ${props.join('\n')}
    }`
  )

  return format(parts.join('\n'))
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