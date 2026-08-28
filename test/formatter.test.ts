import {describe, expect, test} from 'bun:test'
import {DEFAULT_OPTIONS} from '../src'
import {format} from '../src/formatter'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('formatter', () => {
  test('a user-supplied style.filepath takes precedence over the default .d.ts filepath', async () => {
    // An angle-bracket type assertion parses in a .ts/.d.ts file, but not in a .tsx file
    const code = 'export const x = <number>y'
    expect(await format(code, DEFAULT_OPTIONS)).toBe('export const x = <number>y;\n')
    await expect(
      format(code, {...DEFAULT_OPTIONS, style: {...DEFAULT_OPTIONS.style, filepath: 'schema.tsx'}}),
    ).rejects.toThrow()
  })
})
