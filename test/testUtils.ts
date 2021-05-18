import {serial as test} from 'ava'
import {crawl, pathTransform, generateName} from '../src/utils'

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
  test('crawl', t => {
    const schema1 = {
      type: 'object',
      properties: {
        prop1: {enum: [1, 2, 3]},
        prop2: {
          oneOf: [{type: 'string'}, {type: 'number'}]
        },
        prop3: null as unknown
      }
    }
    // circular reference will trigger "Maximum call stack size exceeded" if cycle is not detected
    schema1.properties.prop3 = schema1
    const fn1 = spy()
    crawl(schema1, fn1)
    t.is(fn1.calls.length, 6)
    // only invokes fn on objects, not scalars, not arrays
    t.is(fn1.calls[0][0], schema1.properties.prop1)
    // crawls arrays
    t.is(fn1.calls[1][0], schema1.properties.prop2.oneOf[0])
    t.is(fn1.calls[2][0], schema1.properties.prop2.oneOf[1])
    t.is(fn1.calls[3][0], schema1.properties.prop2)
    // skips prop3 as cycle is detected
    // crawl back up the stack
    t.is(fn1.calls[4][0], schema1.properties)
    t.is(fn1.calls[5][0], schema1)
  })
}

function spy() {
  const calls: unknown[][] = []
  const fn = (...args: unknown[]) => {
    calls.push(args)
  }
  fn.calls = calls
  return fn
}
