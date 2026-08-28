import {describe, expect, test} from 'bun:test'
import {DEFAULT_OPTIONS, Options} from '../src'
import {format} from '../src/formatter'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

// A generated file as `generate` returns it: banner, type aliases, interfaces, enums, split
// before each declaration. It includes the things a batch boundary has to get right: blank lines
// between the groups and after each root schema's enums, comments ahead of declarations, and
// user-supplied text (tsType, bannerComment) with stray whitespace and line endings at the edges.
const PIECES = [
  '/* A banner */\n/**\n* over several lines\n*/',
  '\n\nexport type A = string',
  '\n/**\n * With a comment\n */\nexport type B = "a" | "b" |    "c"',
  '\nexport type C = Map<string,\n  number>   ',
  '\nexport type D = {a: 1} // trailing comment\n',
  '\nexport type D1 = string\n// prettier-ignore',
  '\nexport type D2 = {  ignored:1}|2',
  '\n\nexport interface E {\na?: A;\n"b-c": B[];\n[k: string]: unknown;\n}',
  '\nexport interface F extends E {\r\nf: F;\r\n}',
  '\n\nexport enum G {\n  One = "one",\n  Two = 2\n}\n',
  '\nexport const enum H {}',
  '\n/** I */\nexport enum I { A = "a" }\n\n',
]

function inOnePiece(pieces: string[], options: Options) {
  return format(pieces, options, Infinity)
}

suite('formatter', () => {
  test('a user-supplied style.filepath takes precedence over the default .d.ts filepath', async () => {
    // An angle-bracket type assertion parses in a .ts/.d.ts file, but not in a .tsx file
    const code = ['export const x = <number>y']
    expect(await format(code, DEFAULT_OPTIONS)).toBe('export const x = <number>y;\n')
    await expect(
      format(code, {...DEFAULT_OPTIONS, style: {...DEFAULT_OPTIONS.style, filepath: 'schema.tsx'}}),
    ).rejects.toThrow()
  })

  test('format: false returns the generated text as is', async () => {
    expect(await format(PIECES, {...DEFAULT_OPTIONS, format: false})).toBe(PIECES.join(''))
  })

  test('formatting a large file in batches of declarations gives the same text as formatting it whole', async () => {
    const expected = await inOnePiece(PIECES, DEFAULT_OPTIONS)
    for (const batchSize of [1, 40, 120, 100_000]) {
      expect(await format(PIECES, DEFAULT_OPTIONS, batchSize)).toBe(expected)
    }
  })

  test('batches are joined with the configured line ending', async () => {
    for (const endOfLine of ['crlf', 'cr'] as const) {
      const options = {...DEFAULT_OPTIONS, style: {...DEFAULT_OPTIONS.style, endOfLine}}
      expect(await format(PIECES, options, 1)).toBe(await inOnePiece(PIECES, options))
    }
  })

  test('options that concern the file as a whole are applied to the file as a whole', async () => {
    for (const style of [{insertPragma: true}, {requirePragma: true}, {endOfLine: 'auto' as const}, {rangeEnd: 30}]) {
      const options = {...DEFAULT_OPTIONS, style: {...DEFAULT_OPTIONS.style, ...style}}
      expect(await format(PIECES, options, 1)).toBe(await inOnePiece(PIECES, options))
    }
  })
})
