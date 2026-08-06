import {describe, expect, test} from 'bun:test'
import {compile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('default keyword', () => {
  test('renders schema defaults as JSDoc @default comments', async () => {
    const output = await compile(
      {
        title: 'ExampleSchema',
        type: 'object',
        default: {enabled: true},
        description: 'Schema comment',
        properties: {
          enabled: {
            type: 'boolean',
            default: true,
          },
          retries: {
            type: 'number',
            default: 3,
            description: 'Retry count',
          },
        },
      },
      'ExampleSchema',
    )

    expect(output).toContain('* @default {"enabled":true}')
    expect(output).toContain('* @default true')
    expect(output).toContain('* @default 3')
  })
})
