import {describe, expect, test} from 'bun:test'
import {compile, JSONSchema} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('generator', () => {
  // An enum member's initializer is the JSON value, verbatim. TypeScript enums hold strings and
  // numbers only, so an object member has never been valid output, but compile() must still return
  // it rather than throw in the formatter: `{[k: string]: never}`, the *type* printed for the value
  // `{}` elsewhere, does not parse as an expression.
  test('an object enum member with tsEnumNames is printed as its JSON value', async () => {
    const schema: JSONSchema = {enum: [{}, 'a'], tsEnumNames: ['Empty', 'A']}
    const ts = await compile(schema, 'E', {bannerComment: ''})
    expect(ts).toContain('Empty = {}')
    expect(ts).toContain('A = "a"')
  })
})
