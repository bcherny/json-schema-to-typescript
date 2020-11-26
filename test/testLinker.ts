import test from 'ava'
import {link} from '../src/linker'
import {Parent} from '../src/types/JSONSchema'
import {input} from './e2e/basics'

export function run() {
  test("linker should link to each node's parent schema", t => {
    const schema = link(input) as any
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
}
