/**
 * Structure-aware JSON Schema generator for fuzzing.
 *
 * Deliberately biased toward schemas a real user could plausibly write: bounded
 * depth, bounded node counts, realistic keyword combinations. We are looking for
 * bugs that show up in practice, not for what happens at 10,000 levels of nesting.
 */

// mulberry32 — small, fast, seedable, so every finding is reproducible from its seed.
function makeRng(seed) {
  let a = seed >>> 0
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rng, xs) => xs[Math.floor(rng() * xs.length)]
const chance = (rng, p) => rng() < p

// Names that stress identifier handling — all of them are legal JSON Schema
// property names, and all of them turn up in real-world schemas.
const PROP_NAMES = [
  'id',
  'name',
  'type',
  'value',
  'items',
  'x-custom',
  'kebab-case-name',
  'dotted.name',
  'with space',
  'with"quote',
  "with'quote",
  'with`backtick',
  '0leadingDigit',
  'constructor',
  '__proto__',
  'prototype',
  'toString',
  'class',
  'function',
  'default',
  'Ünïcödé',
  '日本語',
  '🎉emoji',
  '',
]

// Strings that stress comment/JSDoc emission. `*/` in a description can close the
// generated block comment early; newlines and backticks matter for template output.
const TEXTS = [
  'a simple description',
  'ends a comment: */ and keeps going',
  'nested /* comment */ here',
  'line one\nline two',
  'tab\there',
  'back`tick and ${interpolation}',
  'quote " and \' mixed',
  'unicode ✨ 日本語 🎉',
  'a'.repeat(200),
]

const FORMATS = ['date-time', 'email', 'uri', 'uuid', 'ipv4', 'unknown-format']

function randomText(rng) {
  return pick(rng, TEXTS)
}

function randomPropName(rng) {
  return pick(rng, PROP_NAMES)
}

function maybeAnnotate(rng, schema) {
  if (chance(rng, 0.25)) schema.title = randomText(rng)
  if (chance(rng, 0.3)) schema.description = randomText(rng)
  if (chance(rng, 0.08)) schema.default = pick(rng, [null, 0, '', false, {}, []])
  return schema
}

function genEnum(rng) {
  const kind = pick(rng, ['strings', 'mixed', 'numbers', 'withNull', 'objects'])
  let values
  switch (kind) {
    case 'strings':
      values = ['a', 'b', 'c'].slice(0, 1 + Math.floor(rng() * 3))
      break
    case 'mixed':
      values = ['a', 1, true, null]
      break
    case 'numbers':
      values = [0, 1, 2]
      break
    case 'withNull':
      values = [null, 'x']
      break
    default:
      values = [{a: 1}, [1, 2]]
      break
  }
  const schema = {enum: values}
  if (chance(rng, 0.3)) schema.type = 'string'
  // tsEnumNames is an extension; a length mismatch is an easy real-world mistake.
  if (chance(rng, 0.25)) {
    schema.tsEnumNames = values.map((_, i) => `Name${i}`)
    if (chance(rng, 0.3)) schema.tsEnumNames.pop()
  }
  return maybeAnnotate(rng, schema)
}

function genArray(rng, depth, ctx) {
  const schema = {type: 'array'}
  const style = pick(rng, ['items', 'tuple', 'tupleAdditional', 'bare'])
  if (style === 'items') {
    schema.items = genSchema(rng, depth + 1, ctx)
  } else if (style === 'tuple' || style === 'tupleAdditional') {
    const n = 1 + Math.floor(rng() * 3)
    schema.items = Array.from({length: n}, () => genSchema(rng, depth + 1, ctx))
    if (style === 'tupleAdditional') {
      schema.additionalItems = chance(rng, 0.5) ? genSchema(rng, depth + 1, ctx) : false
    }
  }
  // minItems/maxItems drive tuple expansion in the generator, which is the most
  // plausible real-world source of a CPU/memory blowup. Keep the values in the
  // range a human would actually write.
  if (chance(rng, 0.45)) {
    const min = Math.floor(rng() * 8)
    schema.minItems = min
    if (chance(rng, 0.7)) {
      schema.maxItems = min + Math.floor(rng() * 25)
    }
  }
  if (chance(rng, 0.1)) schema.uniqueItems = true
  return maybeAnnotate(rng, schema)
}

function genObject(rng, depth, ctx) {
  const schema = {type: 'object'}
  const propCount = Math.floor(rng() * 4)
  if (propCount > 0) {
    schema.properties = {}
    const used = new Set()
    for (let i = 0; i < propCount; i++) {
      let key = randomPropName(rng)
      if (used.has(key)) key = key + i
      used.add(key)
      schema.properties[key] = genSchema(rng, depth + 1, ctx)
    }
    if (chance(rng, 0.5)) {
      schema.required = Object.keys(schema.properties).filter(() => chance(rng, 0.5))
    }
  }
  if (chance(rng, 0.2)) {
    schema.patternProperties = {
      [pick(rng, ['^x-', '^[a-z]+$', '.*', '^\\d+$'])]: genSchema(rng, depth + 1, ctx),
    }
  }
  if (chance(rng, 0.35)) {
    schema.additionalProperties = chance(rng, 0.5) ? false : genSchema(rng, depth + 1, ctx)
  }
  return maybeAnnotate(rng, schema)
}

function genCombinator(rng, depth, ctx) {
  const key = pick(rng, ['allOf', 'anyOf', 'oneOf'])
  const n = 2 + Math.floor(rng() * 2)
  const schema = {[key]: Array.from({length: n}, () => genSchema(rng, depth + 1, ctx))}
  if (chance(rng, 0.2)) schema.type = 'object'
  return maybeAnnotate(rng, schema)
}

function genRef(rng, ctx) {
  // Only internal refs. External refs are never fuzzed: resolving them would mean
  // touching the network or the filesystem.
  if (ctx.defNames.length === 0) return {type: 'string'}
  return {$ref: `#/definitions/${pick(rng, ctx.defNames)}`}
}

function genSchema(rng, depth, ctx) {
  ctx.nodes++
  // Bounded on purpose: past this point we would be testing pathological input
  // rather than anything a user would hand the compiler.
  if (depth >= ctx.maxDepth || ctx.nodes > ctx.maxNodes) {
    return {type: pick(rng, ['string', 'number', 'boolean', 'null'])}
  }

  const roll = rng()
  if (roll < 0.22) {
    const schema = {type: pick(rng, ['string', 'number', 'integer', 'boolean', 'null'])}
    if (schema.type === 'string' && chance(rng, 0.3)) schema.format = pick(rng, FORMATS)
    if (schema.type === 'string' && chance(rng, 0.15)) schema.pattern = pick(rng, ['^a+$', '\\d+', '.*'])
    return maybeAnnotate(rng, schema)
  }
  if (roll < 0.3) return genEnum(rng)
  if (roll < 0.36) return maybeAnnotate(rng, {const: pick(rng, ['foo', 1, true, null])})
  if (roll < 0.52) return genObject(rng, depth, ctx)
  if (roll < 0.66) return genArray(rng, depth, ctx)
  if (roll < 0.78) return genCombinator(rng, depth, ctx)
  if (roll < 0.84) return genRef(rng, ctx)
  if (roll < 0.88) return maybeAnnotate(rng, {not: genSchema(rng, depth + 1, ctx)})
  if (roll < 0.92) return maybeAnnotate(rng, {type: ['string', 'null']})
  if (roll < 0.95) return maybeAnnotate(rng, {tsType: pick(rng, ['MyType', 'string[]', 'Record<string, unknown>'])})
  if (roll < 0.97) return true
  if (roll < 0.98) return false
  return {}
}

/** Generate a complete root schema for a given seed. */
function generateSchema(seed) {
  const rng = makeRng(seed)
  const ctx = {defNames: [], nodes: 0, maxDepth: 5, maxNodes: 60}

  const root = {$schema: 'http://json-schema.org/draft-07/schema#'}

  // Definitions first, so refs elsewhere have something to point at. Self-refs are
  // allowed and intentional: recursive schemas are extremely common in practice.
  const defCount = Math.floor(rng() * 4)
  if (defCount > 0) {
    root.definitions = {}
    for (let i = 0; i < defCount; i++) {
      const name = pick(rng, ['Node', 'Item', 'Base', 'Entity', 'Ref']) + i
      ctx.defNames.push(name)
      root.definitions[name] = genSchema(rng, 1, ctx)
    }
  }

  const body = genSchema(rng, 0, ctx)
  if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
    Object.assign(root, body)
  } else {
    root.type = 'object'
  }
  if (!root.type && !root.allOf && !root.anyOf && !root.oneOf && !root.$ref && !root.enum) {
    root.type = 'object'
  }
  return root
}

/** Generate an options object for a given seed. */
function generateOptions(seed) {
  const rng = makeRng(seed ^ 0x9e3779b9)
  const options = {
    // Never let a fuzzed schema reach the network or the filesystem.
    $refOptions: {resolve: {file: false, http: false}},
  }
  if (chance(rng, 0.5)) options.format = false
  if (chance(rng, 0.3)) options.unreachableDefinitions = true
  if (chance(rng, 0.3)) options.inferStringEnumKeysFromValues = true
  if (chance(rng, 0.25)) options.strictIndexSignatures = true
  if (chance(rng, 0.25)) options.unknownAny = false
  if (chance(rng, 0.25)) options.enableConstEnums = false
  if (chance(rng, 0.25)) options.additionalProperties = false
  if (chance(rng, 0.2)) options.ignoreMinAndMaxItems = true
  if (chance(rng, 0.3)) options.maxItems = pick(rng, [-1, 0, 1, 5, 20, 100])
  return options
}

module.exports = {generateSchema, generateOptions, makeRng}
