import { whiteBright } from 'cli-color'
import { cloneDeep } from 'lodash'
import { JSONSchema, NormalizedJSONSchema } from './types/JSONSchema'
import { justName, log, mapDeep, toSafeString } from './utils'

type Rule = (schema: JSONSchema, key?: string, fileName?: string) => JSONSchema
const rules = new Map<string, Rule>()

rules.set('Destructure unary types', schema => {
  if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
    schema.type = schema.type[0]
  }
  return schema
})

rules.set('Add empty `required` property if none is defined', schema => {
  if (willBeInterface(schema) && !('required' in schema)) {
    schema.required = []
  }
  return schema
})

rules.set('Transform `required`=false to `required`=[]', schema => {
  if (willBeInterface(schema) && schema.required === false) {
    schema.required = []
  }
  return schema
})

// TODO: default to empty schema (as per spec) instead
rules.set('Default additionalProperties to true', schema => {
  if (willBeInterface(schema) && !('additionalProperties' in schema)) {
    schema.additionalProperties = true
  }
  return schema
})

// TODO: avoid assigning duplicate IDs
// TODO: should IDs be full paths?
let anonymousSchemaIDCounter = 0
rules.set('Default `id`', (schema, key, fileName) => {
  if (!schema.id && willBeInterface(schema)) {
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

export function normalize(schema: JSONSchema, filename: string): NormalizedJSONSchema {
  let _schema = cloneDeep(schema) as NormalizedJSONSchema
  rules.forEach((rule, key) => {
    _schema = mapDeep(_schema, (schema, key) => rule(schema, key, filename)) as NormalizedJSONSchema
    log(whiteBright.bgYellow('normalizer'), `Applied rule: "${key}"`)
  })
  return _schema
}

function willBeInterface(schema: JSONSchema) {
  return Boolean(schema.id || schema.title || schema.properties || schema.definitions)
}
