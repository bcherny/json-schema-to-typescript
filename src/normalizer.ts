import { whiteBright } from 'cli-color'
import { cloneDeep } from 'lodash'
import { JSONSchema, NormalizedJSONSchema } from './types/JSONSchema'
import { justName, log, mapDeep, toSafeString, escapeBlockComment } from './utils'
import stringify = require('json-stringify-safe')

type Rule = (schema: JSONSchema, rootSchema: JSONSchema, fileName?: string) => JSONSchema
const rules = new Map<string, Rule>()

rules.set('Destructure unary types', schema => {
  if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
    schema.type = schema.type[0]
  }
  return schema
})

rules.set('Add empty `required` property if none is defined', (schema, rootSchema) => {
  if (stringify(schema) === stringify(rootSchema) && !('required' in schema)) {
    schema.required = []
  }
  return schema
})

rules.set('Transform `required`=false to `required`=[]', (schema, rootSchema) => {
  if (stringify(schema) === stringify(rootSchema) && schema.required === false) {
    schema.required = []
  }
  return schema
})

// TODO: default to empty schema (as per spec) instead
rules.set('Default additionalProperties to true', (schema, rootSchema) => {
  if (stringify(schema) === stringify(rootSchema) && !('additionalProperties' in schema)) {
    schema.additionalProperties = true
  }
  return schema
})

rules.set('Default top level `id`', (schema, rootSchema, fileName) => {
  if (!schema.id && stringify(schema) === stringify(rootSchema)) {
    schema.id = toSafeString(justName(fileName))
  }
  return schema
})

rules.set('Escape closing JSDoc Comment', schema => {
  escapeBlockComment(schema)
  return schema
})

export function normalize(schema: JSONSchema, filename?: string): NormalizedJSONSchema {
  let _schema = cloneDeep(schema) as NormalizedJSONSchema
  rules.forEach((rule, key) => {
    _schema = mapDeep(_schema, schema => rule(schema, _schema, filename)) as NormalizedJSONSchema
    log(whiteBright.bgYellow('normalizer'), `Applied rule: "${key}"`)
  })
  return _schema
}
