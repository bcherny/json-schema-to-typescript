import {describe, expect, test} from 'bun:test'
import {
  ANNOTATION_KEYWORDS,
  CONTAINER_KEYWORDS,
  JSON_DATA_KEYWORDS,
  KEYWORDS,
  META_KEYWORDS,
  NOT_SCANNED_FOR_DEFINITIONS,
  SUBSCHEMA_KEYWORDS,
  TYPE_SHAPING_KEYWORDS,
} from '../src/keywords'
import {JSONSchema} from '../src/types/JSONSchema'
import {typesOfSchema} from '../src/typesOfSchema'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

// The sets derived from the keyword table, pinned to the hand-kept lists they replaced (as
// those read when the table was introduced), so that the table changes a phase's behavior
// only when someone means it to: a failing pin is updated together with the snapshots it moves.
suite('keywords', () => {
  test('traverse visits the subschema positions it always has, in the same order and way', () => {
    expect(SUBSCHEMA_KEYWORDS).toEqual([
      ['anyOf', 'schemaArray'],
      ['allOf', 'schemaArray'],
      ['oneOf', 'schemaArray'],
      ['properties', 'schemaMap'],
      ['patternProperties', 'schemaMap'],
      ['additionalProperties', 'schemaOrBoolean'],
      ['unevaluatedProperties', 'schemaOrBoolean'],
      ['items', 'schemaOrSchemaArray'],
      ['additionalItems', 'schemaOrBoolean'],
      ['dependencies', 'schemaMap'],
      ['definitions', 'schemaMap'],
      ['$defs', 'schemaMap'],
      ['not', 'schema'],
      ['if', 'schema'],
      ['then', 'schema'],
      ['else', 'schema'],
    ])
  })

  test("traverse's definitions scan skips the keys it always has (utils.ts's former BLACKLISTED_KEYS)", () => {
    expect([...NOT_SCANNED_FOR_DEFINITIONS].sort()).toEqual(
      [
        'id',
        '$defs',
        '$id',
        '$schema',
        'title',
        'description',
        'default',
        'multipleOf',
        'maximum',
        'exclusiveMaximum',
        'minimum',
        'exclusiveMinimum',
        'maxLength',
        'minLength',
        'pattern',
        'additionalItems',
        'items',
        'maxItems',
        'minItems',
        'uniqueItems',
        'maxProperties',
        'minProperties',
        'required',
        'additionalProperties',
        'unevaluatedProperties',
        'definitions',
        'properties',
        'patternProperties',
        'dependencies',
        'enum',
        'type',
        'allOf',
        'anyOf',
        'oneOf',
        'not',
        'if',
        'then',
        'else',
      ].sort(),
    )
  })

  test("isSchemaLike's containers are the ones it always had (utils.ts's former JSON_SCHEMA_KEYWORDS)", () => {
    expect([...CONTAINER_KEYWORDS].sort()).toEqual(
      [
        '$defs',
        'allOf',
        'anyOf',
        'definitions',
        'dependencies',
        'enum',
        'not',
        'oneOf',
        'patternProperties',
        'properties',
        'required',
      ].sort(),
    )
  })

  test("the resolver skips the instance data it always has (utils.ts's former NON_SCHEMA_KEYS)", () => {
    expect([...JSON_DATA_KEYWORDS].sort()).toEqual(['enum', 'const', 'default', 'examples'].sort())
  })

  test("`nullable` leaves the keywords that describe the property outside its anyOf (prenormalizer.ts's former NULLABLE_OUTER_KEYS, plus `readOnly`/`writeOnly`)", () => {
    expect([...META_KEYWORDS].sort()).toEqual(
      ['$defs', '$id', '$schema', 'definitions', 'deprecated', 'description', 'readOnly', 'title', 'writeOnly'].sort(),
    )
  })

  test("the parser recognizes the allOf members it always has (parser.ts's former RECOGNIZED_ALL_OF_MEMBER_KEYWORDS)", () => {
    expect([...TYPE_SHAPING_KEYWORDS].sort()).toEqual(
      [
        '$id',
        'additionalProperties',
        'allOf',
        'anyOf',
        'const',
        'default',
        'enum',
        'extends',
        'items',
        'oneOf',
        'patternProperties',
        'properties',
        'required',
        'tsEnumNames',
        'tsType',
        'type',
      ].sort(),
    )
  })

  test("the parser overlooks the annotations it always has in a required-only member (parser.ts's former ANNOTATION_KEYWORDS)", () => {
    expect([...ANNOTATION_KEYWORDS].sort()).toEqual(
      ['$comment', 'deprecated', 'description', 'examples', 'readOnly', 'writeOnly'].sort(),
    )
  })

  test('every keyword a typesOfSchema matcher reads is in the table, and flagged as shaping the type', () => {
    // Record which keys the matchers look at, across enough schema shapes to take every branch
    const read = new Set<string>()
    const recording = (schema: JSONSchema): JSONSchema =>
      new Proxy(schema, {
        get(target, key, receiver) {
          if (typeof key === 'string') read.add(key)
          return Reflect.get(target, key, receiver)
        },
        has(target, key) {
          if (typeof key === 'string') read.add(key)
          return Reflect.has(target, key)
        },
      })
    const shapes: JSONSchema[] = [
      {},
      {type: 'object'},
      {type: 'array'},
      {type: 'string'},
      {type: ['string', 'null']},
      {enum: [1]},
      {enum: ['a'], tsEnumNames: ['A']},
      {default: true},
      {$id: 'a', properties: {}},
      {patternProperties: {}},
      {items: {}},
      {anyOf: []},
      {oneOf: []},
      {allOf: []},
      {$ref: '#'},
    ]
    shapes.forEach(shape => typesOfSchema(recording(shape)))

    // `$ref` is gone by the time the parser runs (see `hasNoRecognizedKeywords` there), so it
    // needs no row; `tsType` is read by `typesOfSchema` itself rather than a matcher
    read.delete('$ref')
    expect(read.has('tsType')).toBe(true)
    for (const key of read) {
      expect(KEYWORDS).toHaveProperty([key])
      expect(TYPE_SHAPING_KEYWORDS.has(key)).toBe(true)
    }
  })
})
