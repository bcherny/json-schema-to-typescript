import { JSONSchema } from './types/JSONSchema'
import { mapDeep } from './utils'

type Rule = (schema: JSONSchema) => false | void
const rules = new Map<string, Rule>()

rules.set('Enum members and tsEnumNames must be of the same length', schema => {
  if (schema.enum && schema.tsEnumNames && schema.enum.length !== schema.tsEnumNames.length) {
    return false
  }
})

rules.set('tsEnumNames must be an array of strings', schema => {
  if (schema.tsEnumNames && schema.tsEnumNames.some(_ => typeof _ !== 'string')) {
    return false
  }
})

export function validate(schema: JSONSchema, filename: string): string[] {
  const errors: string[] = []
  rules.forEach((rule, ruleName) => {
    mapDeep(schema, (schema, key) => {
      if (rule(schema) === false) {
        errors.push(`Error at key "${key}" in file "${filename}": ${ruleName}`)
      }
      return schema
    })
  })
  return errors
}
