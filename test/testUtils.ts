import test from 'ava'
import {link} from '../src/linker'
import {pathTransform, generateName, isSchemaLike} from '../src/utils'

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
}
