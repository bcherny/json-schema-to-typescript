import {camelCase, map, upperFirst} from 'lodash'
import {readFile} from 'fs'
import * as tsfmt from 'typescript-formatter'
import {Readable} from 'stream'
import {format} from './pretty-printer'

interface Rule {
  description?: string
  minimum?: number
  type: Type
}

type Type = "array"|"boolean"|"integer"|"null"|"number"|"object"|"string"

interface JSONSchema {
  additionalProperties?: boolean
  description?: string
  properties: {
    [a: string]: Rule
  }
  required?: string[]
  title?: string
  type: "array"|"object"
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

function isRequired(propertyName: string, schema: JSONSchema): boolean {
  return schema.required.indexOf(propertyName) > -1
}

function supportsAdditionalProperties(schema: JSONSchema): boolean {
  return !(schema.additionalProperties === false)
}

function toInterfaceName (a: string): string {
  return upperFirst(camelCase(a))
}

const ESFORMATTER_OPTIONS = {
  indent: {
    value: '  '
  }
}

export function compile(schema: JSONSchema): string {

  const props = map(schema.properties, (v, k) =>
    `${k}${isRequired(k, schema) ? '' : '?'}: ${JSONSchemaToTsTypeMap[v.type]};`
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