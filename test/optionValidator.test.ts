import {describe, expect, test} from 'bun:test'
import {validateOptions} from '../src/optionValidator'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('validateOptions', () => {
  test('maxItems accepts -1 and any larger number', () => {
    for (const maxItems of [-1, 0, 1, 20, Infinity]) {
      expect(() => validateOptions({maxItems})).not.toThrow()
    }
  })

  // The CLI hands over `true` for a bare `--maxItems`, a string for `--maxItems abc` and an
  // array for a repeated flag; all used to be compared with `>` as if they were numbers.
  test('maxItems rejects a non-number, NaN and a number below -1', () => {
    const cases: [unknown, string][] = [
      [true, 'true'],
      ['-1', '"-1"'],
      ['abc', '"abc"'],
      [[-1, -1], '[-1,-1]'],
      [NaN, 'null'],
    ]
    for (const [maxItems, given] of cases) {
      expect(() => validateOptions({maxItems: maxItems as number})).toThrow(
        TypeError(`Expected options.maxItems to be a number >= -1, but was given ${given}.`),
      )
    }
    expect(() => validateOptions({maxItems: -2})).toThrow(
      RangeError('Expected options.maxItems to be a number >= -1, but was given -2.'),
    )
  })
})
