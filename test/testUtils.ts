import test from 'ava'
import {link} from '../src/linker'
import {pathTransform, generateName, isSchemaLike, parseFileAsJSONSchema} from '../src/utils'

export function run() {
  test('pathTransform', t => {
    t.is(pathTransform('types', 'schemas', 'schemas/foo/a.json'), 'types/foo')
    t.is(pathTransform('./schemas/types', './schemas', 'schemas/foo/bar/a.json'), 'schemas/types/foo/bar')
    t.is(pathTransform('types', './src/../types/../schemas', 'schemas/foo/a.json'), 'types/foo')
  })
  test('generateName', t => {
    const usedNames = new Set<string>()
    t.is(generateName('a', usedNames), 'A')
    t.is(generateName('abc', usedNames), 'Abc')
    t.is(generateName('ABcd', usedNames), 'ABcd')
    t.is(generateName('$Abc_123', usedNames), '$Abc_123')
    t.is(generateName('Abc-de-f', usedNames), 'AbcDeF')

    // Index should increment:
    t.is(generateName('a', usedNames), 'A1')
    t.is(generateName('a', usedNames), 'A2')
    t.is(generateName('a', usedNames), 'A3')
  })
  test('isSchemaLike', t => {
    const schema = link({
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
      },
      required: ['firstName', 'lastName'],
    })
    t.is(isSchemaLike(schema), true)
    t.is(isSchemaLike([]), false)
    t.is(isSchemaLike(schema.properties), false)
    t.is(isSchemaLike(schema.required), false)
    t.is(isSchemaLike(schema.title), false)
    t.is(isSchemaLike(schema.properties!.firstName), true)
    t.is(isSchemaLike(schema.properties!.lastName), true)
  })
  test('parseFileAsJSONSchema does not apply YAML 1.1 scalar resolution', t => {
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
    t.deepEqual(Object.keys(schema.properties!), ['x', 'y', 'n'])
    t.deepEqual(schema.required, ['x', 'y', 'n'])
    t.deepEqual(schema.enum, ['yes', 'no', 'on', 'off'])
    t.is((schema as any).mode, 777)
    t.is((schema as any).time, '12:30')
  })
  test('parseFileAsJSONSchema supports merge keys and timestamps', t => {
    // Both come from js-yaml@4's default schema, and are not in js-yaml@5's.
    const schema = parseFileAsJSONSchema(
      'schema.yaml',
      ['base: &base {type: string}', 'properties:', '  name:', '    <<: *base', '    default: 2001-12-14'].join('\n'),
    )
    t.is(schema.properties!.name.type, 'string')
    t.true(schema.properties!.name.default instanceof Date)
  })
}
