import {describe, expect, test} from 'bun:test'
import {pathTransform, generateName, isSchemaLike, parseFileAsJSONSchema} from '../src/utils'
import {hasOnly} from './e2eCases'
import {JSONSchema} from '../src/types/JSONSchema'

const suite = hasOnly() ? describe.skip : describe

suite('utils', () => {
  test('pathTransform', () => {
    expect(pathTransform('types', 'schemas', 'schemas/foo/a.json')).toBe('types/foo')
    expect(pathTransform('./schemas/types', './schemas', 'schemas/foo/bar/a.json')).toBe('schemas/types/foo/bar')
    expect(pathTransform('types', './src/../types/../schemas', 'schemas/foo/a.json')).toBe('types/foo')
  })
  test('generateName', () => {
    const usedNames = new Set<string>()
    expect(generateName('a', usedNames)).toBe('A')
    expect(generateName('abc', usedNames)).toBe('Abc')
    expect(generateName('ABcd', usedNames)).toBe('ABcd')
    expect(generateName('$Abc_123', usedNames)).toBe('$Abc_123')
    expect(generateName('Abc-de-f', usedNames)).toBe('AbcDeF')

    // Index should increment:
    expect(generateName('a', usedNames)).toBe('A1')
    expect(generateName('a', usedNames)).toBe('A2')
    expect(generateName('a', usedNames)).toBe('A3')

    // ...to the smallest free index, skipping names taken in the meantime:
    expect(generateName('A4', usedNames)).toBe('A4')
    expect(generateName('A6', usedNames)).toBe('A6')
    expect(generateName('a', usedNames)).toBe('A5')
    expect(generateName('a', usedNames)).toBe('A7')
    expect(generateName('A4', usedNames)).toBe('A41')

    // A fresh set starts over:
    expect(generateName('a', new Set(['A']))).toBe('A1')

    // Many same-named schemas (eg. one copy of a definition per `$ref` with a sibling
    // keyword) must not make naming quadratic
    const start = Date.now()
    for (let i = 0; i < 20000; i++) {
      generateName('Element', usedNames)
    }
    expect(generateName('Element', usedNames)).toBe('Element20000')
    expect(Date.now() - start).toBeLessThan(2000)
  })
  test('isSchemaLike', () => {
    const schema: JSONSchema = {
      title: 'Example Schema',
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          id: 'lastName',
          type: 'string',
        },
        enum: {
          type: 'number',
        },
      },
      required: ['firstName', 'lastName'],
    }
    expect(isSchemaLike(schema, null)).toBe(true)
    expect(isSchemaLike([], schema)).toBe(false)
    expect(isSchemaLike(schema.properties, schema)).toBe(false)
    expect(isSchemaLike(schema.required, schema)).toBe(false)
    expect(isSchemaLike(schema.title, schema)).toBe(false)
    expect(isSchemaLike(schema.properties!.firstName, schema)).toBe(true)
    expect(isSchemaLike(schema.properties!.lastName, schema)).toBe(true)
    expect(isSchemaLike(schema.properties!.enum, schema)).toBe(true)
  })
  test('parseFileAsJSONSchema does not apply YAML 1.1 scalar resolution', () => {
    // Under the YAML 1.1 scalar rules, `y`/`n`/`yes`/`no`/`on`/`off` resolve to
    // booleans, `0777` is octal and `12:30` is sexagesimal. js-yaml@4 did not do
    // this, and doing it silently rewrites property names and enum values.
    const schema = parseFileAsJSONSchema(
      'schema.yaml',
      [
        'type: object',
        'properties:',
        '  x: {type: number}',
        '  y: {type: number}',
        '  n: {type: string}',
        'required: [x, y, n]',
        'enum: [yes, no, on, off]',
        'mode: 0777',
        'time: 12:30',
      ].join('\n'),
    )
    expect(Object.keys(schema.properties!)).toEqual(['x', 'y', 'n'])
    expect(schema.required).toEqual(['x', 'y', 'n'])
    expect(schema.enum).toEqual(['yes', 'no', 'on', 'off'])
    expect((schema as any).mode).toBe(777)
    expect((schema as any).time).toBe('12:30')
  })
  test('parseFileAsJSONSchema supports merge keys and timestamps', () => {
    // Both come from js-yaml@4's default schema, and are not in js-yaml@5's.
    const schema = parseFileAsJSONSchema(
      'schema.yaml',
      ['base: &base {type: string}', 'properties:', '  name:', '    <<: *base', '    default: 2001-12-14'].join('\n'),
    )
    expect(schema.properties!.name.type).toBe('string')
    expect(schema.properties!.name.default).toBeInstanceOf(Date)
  })
})
