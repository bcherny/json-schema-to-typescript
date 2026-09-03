import {describe, expect, test} from 'bun:test'
import {JSONSchema} from '../src'
import {link} from '../src/linker'
import {validate} from '../src/validator'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

function errorsFor(schema: JSONSchema): string[] {
  return validate(link(schema), 'test.json')
}

suite('validator', () => {
  // Two members of one enum cannot share a name (TS2300 "Duplicate identifier")
  test('a name listed twice in tsEnumNames is an error', () => {
    expect(
      errorsFor({
        type: 'object',
        properties: {p: {type: 'string', enum: ['a', 'b', 'c'], tsEnumNames: ['Same', 'Other', 'Same']}},
      }),
    ).toEqual(['Error at key "p" in file "test.json": tsEnumNames must not contain duplicates'])
    // controls: distinct names pass, and so do repeated *values* under distinct names
    // (`A = "a", B = "a"` is a valid enum)
    expect(errorsFor({type: 'string', enum: ['a', 'b'], tsEnumNames: ['A', 'B']})).toEqual([])
    expect(errorsFor({type: 'string', enum: ['a', 'a'], tsEnumNames: ['A', 'B']})).toEqual([])
  })
})
