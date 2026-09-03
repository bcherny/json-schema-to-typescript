import {describe, expect, test} from 'bun:test'
import {compile, JSONSchema} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('optimizer', () => {
  // A union or intersection can be, through a `$ref`, one of its own members. The optimizer looks
  // into set-operation members to tell whether one matches anything, and has to stop at a member
  // it has already entered. (Not e2e cases: the aliases these emit are circular by construction.)
  const selfMembers: Record<string, JSONSchema> = {
    'a root that is a member of its own anyOf': {type: 'string', anyOf: [{$ref: '#'}, {format: 'hostname'}]},
    'a definition that is a member of its own allOf': {
      type: 'object',
      properties: {e: {$ref: '#/definitions/expr'}},
      definitions: {expr: {allOf: [{$ref: '#/definitions/expr'}, {type: 'object', properties: {a: {type: 'string'}}}]}},
    },
    'two definitions that are members of each other': {
      type: 'object',
      properties: {e: {$ref: '#/definitions/a'}},
      definitions: {
        a: {oneOf: [{$ref: '#/definitions/b'}, {type: 'number'}]},
        b: {oneOf: [{$ref: '#/definitions/a'}, {type: 'string'}]},
      },
    },
  }
  for (const [name, schema] of Object.entries(selfMembers)) {
    test(`terminates on ${name}`, async () => {
      expect(await compile(schema, 'X', {bannerComment: ''})).toContain('export ')
    })
  }

  // [A | (B | C)] -> [A | B | C] lifts an anonymous nested union into the enclosing one, except a
  // described `const` / inline `enum` branch: that is one member with one description, kept whole
  test('a nested anonymous union is flattened unless it is a described literal branch', async () => {
    const schema: JSONSchema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        plain: {anyOf: [{enum: ['red', 'green']}, {const: 'blue'}]},
        described: {anyOf: [{enum: ['red', 'green'], description: 'Additive primaries.'}, {const: 'blue'}]},
      },
    }
    const ts = await compile(schema, 'X', {bannerComment: ''})
    expect(ts).toContain('plain?: "red" | "green" | "blue";')
    expect(ts).toContain('("red" | "green")')
  })
})
