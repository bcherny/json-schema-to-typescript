import {map} from 'lodash'
import {readFile} from 'fs'

interface Rule {
  description?: string
  minimum?: number
  type: Type
}

type Type = "array"|"boolean"|"integer"|"null"|"number"|"object"|"string"

interface JSONSchema {
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

export function compile(schema: JSONSchema): string {
  return `
    interface ${schema.title} {
      ${
        map(schema.properties, (v, k) =>
          `${k}${isRequired(k, schema) ? '' : '?'}: ${JSONSchemaToTsTypeMap[v.type]}`
        ).join('\n')
      }
    }
  `
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