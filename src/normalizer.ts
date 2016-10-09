import { JSONSchema } from './JSONSchema'
import { cloneDeep } from 'lodash'

const rules = new Map<string, (schema: JSONSchema) => JSONSchema>()

rules.set('', schema => {
  if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
    schema.type = schema.type[0]
  }
})

export function normalize(schema: JSONSchema): JSONSchema {
  let _schema = cloneDeep(schema)
  rules.forEach((rule, key) => {
    _schema = rule(_schema)
    console.info(`[Normalize] Applied rule: "${key}"`)
  })
  return _schema
}
