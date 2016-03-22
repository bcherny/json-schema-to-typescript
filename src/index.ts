import {map} from 'lodash'
import {readFile} from 'fs'

interface Interface {
  name: string
  rules: Rule[]
}

type Type = "boolean"|"number"|"string"

interface Rule {
  comment?: string
  name: string
  required: boolean
  type: Type
}

interface JSONSchemaRule {
  description?: string
  minimum?: number
  type: JSONSchemaRuleType
}

type JSONSchemaRuleType = "integer"|"string"

interface JSONSchema {
  name?: string
  properties: {
    [a: string]: JSONSchemaRule
  }
  required?: string[]
  type: "array"|"object"
}

const JSONSchemaToTsTypeMap = {
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

export function compile(schema: JSONSchema): string {
  return `
    interface ${schema.name} {
      ${
        map(schema.properties, (v, k) =>
          `${k}${isRequired(k, schema) ? '' : '?'}: ${JSONSchemaToTsTypeMap[v.type]}`
        ).join('\n')
      }
    }
  `
}

export function compileFromFile(inputFilename: string): Promise<string> {
  return readFile(inputFilename, (err, data) => {
    const a = compile(JSON.parse(data))
    console.log(a)
    return a
  })
}