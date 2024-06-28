import test from 'ava'
import {annotate} from '../src/annotator'
import {Parent} from '../src/types/JSONSchema'
import {input} from './e2e/basics'

export function run() {
  test("annotator should link to each node's parent schema", t => {
    const schema = annotate(input) as any
    t.is(schema[Parent], null)
    t.is(schema.properties[Parent], schema)
    t.is(schema.properties.firstName[Parent], schema.properties)
    t.is(schema.properties.lastName[Parent], schema.properties)
    t.is(schema.properties.age[Parent], schema.properties)
    t.is(schema.properties.height[Parent], schema.properties)
    t.is(schema.properties.favoriteFoods[Parent], schema.properties)
    t.is(schema.properties.likesDogs[Parent], schema.properties)
    t.is(schema.required[Parent], schema)
  })

  // test('annotator should add key names from $refs', t => {
  //   const input: JSONSchema = {
  //     definitions: {
  //       x: {type: 'string'},
  //       y: {type: 'number'},
  //       z: {$ref: '#/definitions/y'},
  //     },
  //     properties: {
  //       a: {$ref: '#/definitions/x'},
  //       b: {$ref: '#/definitions/x'},
  //       c: {$ref: '#/definitions/y'},
  //       d: {$ref: '#/definitions/z'},
  //       e: {$ref: '#/properties/e'},
  //       f: {type: 'string'},
  //     },
  //   }
  //   const schema = annotate(input, new WeakMap())
  //   t.is(schema[KeyNameFromDefinition], undefined)
  //   t.is(schema.definitions![KeyNameFromDefinition as any], undefined as any)
  //   t.is(schema.definitions!.x[KeyNameFromDefinition], undefined)
  //   t.is(schema.definitions!.y[KeyNameFromDefinition], undefined)
  //   t.is(schema.definitions!.z[KeyNameFromDefinition], undefined)
  //   t.is(schema.properties![KeyNameFromDefinition as any], undefined as any)
  //   t.is(schema.properties!.a[KeyNameFromDefinition], 'x')
  //   t.is(schema.properties!.b[KeyNameFromDefinition], 'x')
  //   t.is(schema.properties!.c[KeyNameFromDefinition], 'y')
  //   t.is(schema.properties!.d[KeyNameFromDefinition], 'z')
  //   t.is(schema.properties!.e[KeyNameFromDefinition], 'e')
  //   t.is(schema.properties!.f[KeyNameFromDefinition], undefined)
  // })
}
