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
  // `true` (a bare `--maxItems`) and strings used to slip through and be compared with `>` as
  // if they were numbers (true as 1, a string as NaN); refuse everything that is not a number.
  if (maxItems !== undefined && (typeof maxItems !== 'number' || Number.isNaN(maxItems))) {
    throw new UserError(`Expected options.maxItems to be a number >= -1, but was given ${JSON.stringify(maxItems)}.`)
  }
  if (maxItems !== undefined && maxItems < -1) {
    throw new UserError(`Expected options.maxItems to be a number >= -1, but was given ${maxItems}.`)
  }
}
