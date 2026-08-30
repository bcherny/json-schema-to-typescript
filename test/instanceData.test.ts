import {expect, test} from 'bun:test'
import {compile} from '../src'

test('keeps `$ref`-shaped objects inside instance data literal', async () => {
  const output = await compile(
    {
      title: 'LiteralRefs',
      type: 'object',
      properties: {
        constValue: {const: {$ref: '#/$defs/Literal'}},
        enumValue: {enum: [{$ref: '#/$defs/Literal'}]},
      },
      $defs: {
        Literal: {type: 'string'},
      },
      additionalProperties: false,
    },
    'LiteralRefs',
    {format: false},
  )

  expect(output).toContain('constValue?: {"$ref":"#/$defs/Literal"}')
  expect(output).toContain('enumValue?: {"$ref":"#/$defs/Literal"}')
})

test('keeps literal refs when another ref selects the general resolver path', async () => {
  const output = await compile(
    {
      title: 'LiteralRefs',
      type: 'object',
      properties: {
        literal: {const: {$ref: '#/$defs/Literal'}},
        actual: {$ref: '#/%24defs/Literal'},
      },
      $defs: {
        Literal: {type: 'string'},
      },
      additionalProperties: false,
    },
    'LiteralRefs',
    {format: false},
  )

  expect(output).toContain('literal?: {"$ref":"#/$defs/Literal"}')
  expect(output).toContain('actual?: Literal')
})
