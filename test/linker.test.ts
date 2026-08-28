import {describe, expect, test} from 'bun:test'
import {link} from '../src/linker'
import {Parent, Shared} from '../src/types/JSONSchema'
import {input} from './e2e/basics'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

suite('linker', () => {
  test("linker should link to each node's parent schema", () => {
    const schema = link(input) as any
    expect(schema[Parent]).toBe(null)
    expect(schema.properties[Parent]).toBe(schema)
    expect(schema.properties.firstName[Parent]).toBe(schema.properties)
    expect(schema.properties.lastName[Parent]).toBe(schema.properties)
    expect(schema.properties.age[Parent]).toBe(schema.properties)
    expect(schema.properties.height[Parent]).toBe(schema.properties)
    expect(schema.properties.favoriteFoods[Parent]).toBe(schema.properties)
    expect(schema.properties.likesDogs[Parent]).toBe(schema.properties)
    expect(schema.required[Parent]).toBe(schema)
    expect(schema.properties.firstName[Shared]).toBe(undefined)
  })

  test('linker should keep the first parent of a node it meets twice, and mark the node shared', () => {
    const shared = {type: 'string'}
    const schema = link({properties: {a: shared, b: shared}, anyOf: [shared]}) as any
    expect(schema.properties.a[Parent]).toBe(schema.properties)
    expect(schema.properties.a[Shared]).toBe(true)
    expect(schema.properties[Shared]).toBe(undefined)
  })
})
