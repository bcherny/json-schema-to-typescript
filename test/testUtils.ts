import test from 'ava'
import {link} from '../src/linker'
import {LinkedJSONSchema} from '../src/types/JSONSchema'
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

    // Leading invalid characters should be removed
    t.is(generateName('2022Abc-de-f', usedNames), 'AbcDeF1')
    t.is(generateName('555tartsWithThreeDigits', usedNames), 'TartsWithThreeDigits')
    t.is(generateName('1234555666tartsWithManyDigits', usedNames), 'TartsWithManyDigits')
    t.is(generateName('123-455-5666%% startsWithDigitsAndSpecialChars', usedNames), 'StartsWithDigitsAndSpecialChars')
    t.is(generateName('123456$Abc_123', usedNames), '$Abc_1231') // there's already '$Abc_123' on line 17 above
    t.is(generateName('654321_cbA_123', usedNames), '_CbA_123')
    t.is(generateName('1654321_cbA_123', usedNames), '_CbA_1231') // there's already '_CbA_123' output above

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
          type: 'string'
        },
        lastName: {
          id: 'lastName',
          type: 'string'
        }
      },
      required: ['firstName', 'lastName']
    })
    t.is(isSchemaLike(schema), true)
    t.is(isSchemaLike([] as any as LinkedJSONSchema), false)
    t.is(isSchemaLike(schema.properties as LinkedJSONSchema), false)
    t.is(isSchemaLike(schema.required as any as LinkedJSONSchema), false)
    t.is(isSchemaLike(schema.title as any as LinkedJSONSchema), false)
    t.is(isSchemaLike(schema.properties!.firstName), true)
    t.is(isSchemaLike(schema.properties!.lastName), true)
  })
}
