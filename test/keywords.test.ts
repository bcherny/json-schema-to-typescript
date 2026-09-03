import {describe, expect, test} from 'bun:test'
import {
  ANNOTATION_KEYWORDS,
  CONTAINER_KEYWORDS,
  EXTENDING_KEYWORDS,
  JSON_DATA_KEYWORDS,
  KEYWORDS,
  META_KEYWORDS,
  NOT_SCANNED_FOR_DEFINITIONS,
  SCHEMA_HOLDING_KEYWORDS,
  STRUCTURAL_KEYWORDS,
  SUBSCHEMA_KEYWORDS,
  TYPE_RELEVANT_KEYWORDS,
  TYPE_SHAPING_KEYWORDS,
  VALIDATION_KEYWORDS,
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
      ['prefixItems', 'schemaArray'],
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

  test('the resolver judges $ref targets in those same positions plus `extends`, which traverse never visited', () => {
    expect(SCHEMA_HOLDING_KEYWORDS).toEqual([...SUBSCHEMA_KEYWORDS, ['extends', 'schemaOrSchemaArray']])
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
        'prefixItems',
        'maxItems',
        'minItems',
        'uniqueItems',
        'maxProperties',
        'minProperties',
        'required',
        'format',
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
        'prefixItems',
        'properties',
        'required',
      ].sort(),
    )
  })

  test("the resolver skips the instance data it always has (utils.ts's former NON_SCHEMA_KEYS)", () => {
    expect([...JSON_DATA_KEYWORDS].sort()).toEqual(['enum', 'const', 'default', 'examples'].sort())
  })

  test("`nullable` leaves the keywords outside its anyOf it always has (prenormalizer.ts's former NULLABLE_OUTER_KEYS)", () => {
    expect([...META_KEYWORDS].sort()).toEqual(
      ['$defs', '$id', '$schema', 'definitions', 'deprecated', 'description', 'title'].sort(),
    )
  })

  test("the parser recognizes the allOf members it always has (parser.ts's former RECOGNIZED_ALL_OF_MEMBER_KEYWORDS)", () => {
    // ...less `$id`, which names a type rather than shaping one: a member that is only an `$id`
    // is kept either way, for its name
    expect([...TYPE_SHAPING_KEYWORDS].sort()).toEqual(
      [
        'additionalProperties',
        'allOf',
        'anyOf',
        'const',
        'default',
        'enum',
        'extends',
        'items',
        'prefixItems',
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

  test('typesOfSchema reads a schema with none of these as the empty schema', () => {
    // not `definitions`/`$defs`: hosting schemas for others to `$ref` says nothing about instances
    expect([...STRUCTURAL_KEYWORDS].sort()).toEqual(
      [
        'additionalItems',
        'additionalProperties',
        'allOf',
        'anyOf',
        'const',
        'dependencies',
        'else',
        'enum',
        'extends',
        'if',
        'items',
        'not',
        'oneOf',
        'patternProperties',
        'prefixItems',
        'properties',
        'required',
        'then',
        'tsEnumNames',
        'tsType',
        'type',
        'unevaluatedProperties',
      ].sort(),
    )
  })

  test("the parser overlooks the annotations it always has in a required-only member (parser.ts's former ANNOTATION_KEYWORDS)", () => {
    expect([...ANNOTATION_KEYWORDS].sort()).toEqual(
      ['$comment', 'deprecated', 'description', 'examples', 'readOnly', 'writeOnly'].sort(),
    )
  })

  test("the `$ref` siblings that keep the resolver's merged copy (prenormalizer.ts)", () => {
    expect([...TYPE_RELEVANT_KEYWORDS].sort()).toEqual(
      [
        '$id',
        'additionalItems',
        'additionalProperties',
        'allOf',
        'anyOf',
        'const',
        'enum',
        'extends',
        'format',
        'id',
        'items',
        'maxItems',
        'minItems',
        'minProperties',
        'oneOf',
        'patternProperties',
        'prefixItems',
        'properties',
        'required',
        'tsEnumNames',
        'tsType',
        'type',
        'unevaluatedProperties',
      ].sort(),
    )
  })

  test('the `$ref` siblings that are composed with the reference instead (prenormalizer.ts)', () => {
    expect([...EXTENDING_KEYWORDS].sort()).toEqual(
      [
        'allOf',
        'anyOf',
        'extends',
        'items',
        'oneOf',
        'patternProperties',
        'prefixItems',
        'properties',
        'required',
      ].sort(),
    )
  })

  test('...taking these with them into the `allOf`, and leaving the rest on the referencing schema', () => {
    expect([...VALIDATION_KEYWORDS].sort()).toEqual(
      [
        'additionalItems',
        'additionalProperties',
        'allOf',
        'anyOf',
        'const',
        'dependencies',
        'else',
        'enum',
        'exclusiveMaximum',
        'exclusiveMinimum',
        'extends',
        'format',
        'if',
        'items',
        'maxItems',
        'maxLength',
        'maxProperties',
        'maximum',
        'minItems',
        'minLength',
        'minProperties',
        'minimum',
        'multipleOf',
        'not',
        'oneOf',
        'pattern',
        'patternProperties',
        'prefixItems',
        'properties',
        'required',
        'then',
        'tsEnumNames',
        'tsType',
        'type',
        'unevaluatedProperties',
        'uniqueItems',
      ].sort(),
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
    // needs no row; `$id` only tells `NAMED_SCHEMA` from `UNNAMED_SCHEMA`, which parse to the
    // same shape; `tsType` is read by `typesOfSchema` itself rather than a matcher
    read.delete('$ref')
    read.delete('$id')
    expect(read.has('tsType')).toBe(true)
    for (const key of read) {
      expect(KEYWORDS).toHaveProperty([key])
      expect(TYPE_SHAPING_KEYWORDS.has(key)).toBe(true)
    }
  })
})
