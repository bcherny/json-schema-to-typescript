import {isPlainObject} from 'lodash'
import {Options} from '.'
import {UserError} from './utils'

export function validateOptions({declarationStyle, formatTypes, maxItems}: Partial<Options>): void {
  if (declarationStyle !== undefined && declarationStyle !== 'interface' && declarationStyle !== 'type') {
    throw new UserError(
      `Expected options.declarationStyle to be "interface" or "type", but was given ${declarationStyle}.`,
    )
  }
  if (
    formatTypes !== undefined &&
    !(isPlainObject(formatTypes) && Object.values(formatTypes).every(_ => typeof _ === 'string'))
  ) {
    throw new UserError(
      `Expected options.formatTypes to map format names to TypeScript types (eg. {"date-time": "Date"}), but was given ${JSON.stringify(
        formatTypes,
      )}.`,
    )
  }
  if (maxItems !== undefined && maxItems < -1) {
    throw new UserError(`Expected options.maxItems to be >= -1, but was given ${maxItems}.`)
  }
}
