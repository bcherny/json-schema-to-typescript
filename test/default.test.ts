import {describe, expect, test} from 'bun:test'
import {compile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

function normalizeCommentIndentation(output: string): string {
  return output.replace(/^\s+\*/gm, '*')
}

suite('default keyword', () => {
  test('renders JSON primitive defaults as one-line JSDoc @default comments', async () => {
    const output = normalizeCommentIndentation(
      await compile(
        {
          title: 'PrimitiveDefaults',
          type: 'object',
          properties: {
            stringValue: {
              type: 'string',
              default: 'hello',
            },
            numberValue: {
              type: 'number',
              default: 3,
            },
            booleanValue: {
              type: 'boolean',
              default: true,
            },
            nullValue: {
              type: 'null',
              default: null,
            },
          },
        },
        'PrimitiveDefaults',
      ),
    )

    expect(output).toContain('* @default "hello"')
    expect(output).toContain('* @default 3')
    expect(output).toContain('* @default true')
    expect(output).toContain('* @default null')
  })

  test('renders object and array defaults as multiline JSDoc @default comments', async () => {
    const output = normalizeCommentIndentation(
      await compile(
        {
          title: 'ComplexDefaults',
          type: 'object',
          default: {
            enabled: true,
            nested: {
              '1+1': 2,
              foo: 'bar',
            },
            arr: [{'123': null}],
          },
          properties: {
            config: {
              type: 'object',
              default: {
                enabled: true,
                nested: {
                  hello_world: 0,
                  'x-y-z': 'u-v-w',
                },
              },
            },
            values: {
              type: 'array',
              default: [{foo_bar: 1}, null, 'testing'],
            },
          },
        },
        'ComplexDefaults',
      ),
    )

    expect(output).toContain(
      [
        '* @default {',
        '*   enabled: true,',
        '*   nested: {',
        '*     "1+1": 2,',
        '*     foo: "bar"',
        '*   },',
        '*   arr: [',
        '*     { "123": null }',
        '*   ]',
        '* }',
      ].join('\n'),
    )

    expect(output).toContain(
      [
        '* @default {',
        '*   enabled: true,',
        '*   nested: {',
        '*     hello_world: 0,',
        '*     "x-y-z": "u-v-w"',
        '*   }',
        '* }',
      ].join('\n'),
    )

    expect(output).toContain(['* @default [', '*   { foo_bar: 1 },', '*   null,', '*   "testing"', '* ]'].join('\n'))
  })

  test('does not generate @default comments when enableDefaultComments is false', async () => {
    const output = await compile(
      {
        title: 'NoDefaults',
        type: 'object',
        properties: {
          stringValue: {
            type: 'string',
            default: 'hello',
          },
          numberValue: {
            type: 'number',
            default: 3,
          },
        },
      },
      'NoDefaults',
      {enableDefaultComments: false},
    )

    expect(output).not.toContain('@default')
  })

  test('does not prettify object/array @default values when prettifyDefaultComments is false', async () => {
    const output = normalizeCommentIndentation(
      await compile(
        {
          title: 'NonPrettifiedDefaults',
          type: 'object',
          default: {
            enabled: true,
            nested: {key: 'value'},
          },
          properties: {
            config: {
              type: 'object',
              default: {a: 1, b: 2},
            },
            values: {
              type: 'array',
              default: [1, 2, 3],
            },
          },
        },
        'NonPrettifiedDefaults',
        {prettifyDefaultComments: false},
      ),
    )

    expect(output).toContain('* @default {"enabled":true,"nested":{"key":"value"}}')
    expect(output).toContain('* @default {"a":1,"b":2}')
    expect(output).toContain('* @default [1,2,3]')
  })
})
