import { cloneDeep } from 'lodash'
import { JSONSchema } from './types/JSONSchema'
import { justName, mapDeep, toSafeString } from './utils'

type Rule = (schema: JSONSchema, rootSchema: JSONSchema, key?: string, fileName?: string) => JSONSchema
const rules = new Map<string, Rule>()

rules.set('Destructure unary types', schema => {
  if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
    schema.type = schema.type[0]
  }
  return schema
})

rules.set('Add empty `required` property if none is defined', schema => {
  if (schema.properties && !('required' in schema)) {
    schema.required = []
  }
  return schema
})

rules.set('Transform `required`=false to `required`=[]', schema => {
  if (schema.properties && schema.required === false) {
    schema.required = []
  }
  return schema
})

// TODO: default to empty schema (as per spec) instead
rules.set('Default additionalProperties to true', schema => {
  if (schema.properties && !('additionalProperties' in schema)) {
    schema.additionalProperties = true
  }
  return schema
})

// TODO: avoid assigning duplicate IDs
// TODO: should IDs be full paths?
let anonymousSchemaIDCounter = 0
rules.set('Default `id`', (schema, rootSchema, key, fileName) => {
  if (!schema.id && schemaNeedsID(key)) {
    if (key) {
      schema.id = key
    } else if (fileName) {
      schema.id = toSafeString(justName(fileName))
    } else {
      schema.id = `Interface${anonymousSchemaIDCounter++}`
    }
  }
  return schema
})
function schemaNeedsID(key?: string): boolean {
  return key !== 'definitions' && key !== 'properties'
}

// - {$ref: '#/'} => {$ref: '#'}
rules.set('Normalize self-ref', schema => {
  if (schema.$ref && schema.$ref.endsWith('#/')) {
    schema.$ref = schema.$ref.replace('#/', '#')
  }
  return schema
})

// hacky implementation, because we need to preserve context
//  - "#" -> "file.json/#"
//  - "#/foo/bar" -> "file.json/foo/bar
rules.set('Convert relative $refs to absolute', (schema, rootSchema, key, fileName) => {
  if (schema.$ref && schema.$ref.startsWith('#')) {
    schema.$ref = fileName + schema.$ref
  }
  return schema
})

export function normalize(schema: JSONSchema, fileName: string): JSONSchema {
  let _schema = cloneDeep(schema)
  rules.forEach((rule, key) => {
    _schema = mapDeep(_schema, (schema, key) => rule(schema, _schema, key, fileName))
    console.info(`[Normalize] Applied rule: "${key}"`)
  })
  return _schema
}
