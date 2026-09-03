import {JSONSchema, LinkedJSONSchema} from './types/JSONSchema'
import {traverse} from './utils'

type Rule = (schema: JSONSchema) => boolean | void
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

// Two members of one enum cannot share a name (TS2300 "Duplicate identifier")
rules.set('tsEnumNames must not contain duplicates', schema => {
  if (schema.tsEnumNames) {
    return new Set(schema.tsEnumNames).size === schema.tsEnumNames.length
  }
})

rules.set('When both maxItems and minItems are present, maxItems >= minItems', schema => {
  const {maxItems, minItems} = schema
  if (typeof maxItems === 'number' && typeof minItems === 'number') {
    return maxItems >= minItems
  }
})

rules.set('When maxItems exists, maxItems >= 0', schema => {
  const {maxItems} = schema
  if (typeof maxItems === 'number') {
    return maxItems >= 0
  }
})

rules.set('When minItems exists, minItems >= 0', schema => {
  const {minItems} = schema
  if (typeof minItems === 'number') {
    return minItems >= 0
  }
})

rules.set('deprecated must be a boolean', schema => {
  const typeOfDeprecated = typeof schema.deprecated
  return typeOfDeprecated === 'boolean' || typeOfDeprecated === 'undefined'
})

export function validate(schema: LinkedJSONSchema, filename: string): string[] {
  // All rules share one walk over the schema; errors are still listed rule by rule
  const checks = [...rules].map(([ruleName, rule]) => ({ruleName, rule, errors: [] as string[]}))
  traverse(schema, (schema, key) => {
    for (const {ruleName, rule, errors} of checks) {
      if (rule(schema) === false) {
        errors.push(`Error at key "${key}" in file "${filename}": ${ruleName}`)
      }
    }
  })
  return checks.flatMap(_ => _.errors)
}
