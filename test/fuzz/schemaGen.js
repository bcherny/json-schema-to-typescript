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
  '+1',
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
  '#1 choice',
  '2020-12',
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

// String enum values that are not identifiers. All common in real schemas ("" for
// unset, "3d", "0"/"1" flags, kebab-case and dotted tokens), and each one is a trap
// for anything that derives a TypeScript name from the value.
const ODD_STRINGS = ['', '3d', '0', 'not-set', 'with space', 'v1.2', '日本語']

function genEnum(rng) {
  // Weighted toward string enums, which is what nearly every enum in the wild is.
  const kind = pick(rng, ['strings', 'strings', 'strings', 'mixed', 'numbers', 'withNull', 'objects'])
  let values
  switch (kind) {
    case 'strings':
      values = ['a', 'b', 'c'].slice(0, 1 + Math.floor(rng() * 3))
      if (chance(rng, 0.6)) values.splice(1, 1, pick(rng, ODD_STRINGS))
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
  if (chance(rng, kind === 'strings' ? 0.7 : 0.3)) schema.type = 'string'
  // tsEnumNames is an extension; a length mismatch is an easy real-world mistake.
  if (chance(rng, 0.25)) {
    schema.tsEnumNames = values.map((_, i) => `Name${i}`)
    if (chance(rng, 0.3)) schema.tsEnumNames.pop()
  }
  return maybeAnnotate(rng, schema)
}

// An array of arrays (of arrays), every level with the kind of bounds people write
// for grids, matrices and coordinate lists. Each level is modest on its own; it is
// the product across levels that decides how much the tuple expansion emits.
function genNestedBoundedArray(rng, depth, ctx, levels) {
  ctx.nodes++
  const schema = {type: 'array'}
  schema.items =
    levels > 1 && depth + 1 < ctx.maxDepth
      ? genNestedBoundedArray(rng, depth + 1, ctx, levels - 1)
      : {type: pick(rng, ['number', 'string', 'boolean'])}
  schema.minItems = Math.floor(rng() * 4)
  schema.maxItems = schema.minItems + 8 + Math.floor(rng() * 16)
  return schema
}

function genArray(rng, depth, ctx) {
  const style = pick(rng, ['items', 'tuple', 'tupleAdditional', 'bare', 'nestedBounded'])
  if (style === 'nestedBounded')
    return maybeAnnotate(rng, genNestedBoundedArray(rng, depth, ctx, 2 + Math.floor(rng() * 2)))
  const schema = {type: 'array'}
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
  // The "extends" idiom: an object that is allOf a base definition plus its own
  // properties. It types as both an intersection and an object at once.
  if (key === 'allOf' && ctx.defNames.length && chance(rng, 0.4)) {
    const schema = genObject(rng, depth, ctx)
    schema.allOf = [genRef(rng, ctx)]
    return schema
  }
  const n = 2 + Math.floor(rng() * 2)
  const schema = {[key]: Array.from({length: n}, () => genSchema(rng, depth + 1, ctx))}
  if (chance(rng, 0.2)) schema.type = 'object'
  return maybeAnnotate(rng, schema)
}

function genRef(rng, ctx) {
  // Only internal refs. External refs are never fuzzed: resolving them would mean
  // touching the network or the filesystem. The root itself (`#`) is a target now
  // and then; with no definitions it is the only one, and usually a plain leaf wins.
  const defs = ctx.defNames
  if (!defs.length && !chance(rng, 0.3)) return {type: 'string'}
  const target = defs.length && !chance(rng, 0.15) ? `#/definitions/${pick(rng, defs)}` : '#'
  return refTo(target, rng)
}

/**
 * A `$ref`, as often as in practice with keywords beside it: a description of this
 * use of the type or a vendor note (annotations, kept next to the reference), or
 * "this type, but with these keys required / closed" (refinements, which get a
 * merged copy of the target instead of a reference to it).
 */
function refTo(target, rng) {
  const schema = {$ref: target}
  if (chance(rng, 0.3)) schema.description = randomText(rng)
  if (chance(rng, 0.1)) schema['x-note'] = randomText(rng)
  if (chance(rng, 0.15)) schema.required = [pick(rng, ['id', 'name', 'value'])]
  if (chance(rng, 0.1)) schema.type = 'object'
  if (chance(rng, 0.05)) schema.additionalProperties = false
  return schema
}

function genSchema(rng, depth, ctx) {
  ctx.nodes++
  // Bounded on purpose: past this point we would be testing pathological input
  // rather than anything a user would hand the compiler.
  if (depth >= ctx.maxDepth || ctx.nodes > ctx.maxNodes) {
    return chance(rng, 0.15) ? genEnum(rng) : {type: pick(rng, ['string', 'number', 'boolean', 'null'])}
  }

  const roll = rng()
  if (roll < 0.2) {
    const schema = {type: pick(rng, ['string', 'number', 'integer', 'boolean', 'null'])}
    if (schema.type === 'string' && chance(rng, 0.3)) schema.format = pick(rng, FORMATS)
    if (schema.type === 'string' && chance(rng, 0.15)) schema.pattern = pick(rng, ['^a+$', '\\d+', '.*'])
    return maybeAnnotate(rng, schema)
  }
  if (roll < 0.32) return genEnum(rng)
  if (roll < 0.37) return maybeAnnotate(rng, {const: pick(rng, ['foo', 1, true, null])})
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

/** The classic recursive definition: a node whose children are nodes. */
function genTree(rng, ctx, name) {
  ctx.nodes += 2 // the node object and `children`; `value` counts itself
  const self = refTo(`#/definitions/${name}`, rng)
  const children = chance(rng, 0.5) ? {type: 'array', items: self} : self
  const schema = {type: 'object', properties: {value: genSchema(rng, 2, ctx), children}}
  if (chance(rng, 0.3)) schema.additionalProperties = false
  // ...which, as often as not, extends some base definition.
  const bases = ctx.defNames.filter(_ => _ !== name)
  if (bases.length && chance(rng, 0.4)) schema.allOf = [{$ref: `#/definitions/${pick(rng, bases)}`}]
  return maybeAnnotate(rng, schema)
}

/**
 * A definition (or the root) that is nothing but a `$ref` to itself, to a later
 * definition or to the root can close a loop of references with no actual type in
 * it (`A = A`). The compiler rejects those on purpose, so they are not worth a
 * case: point such a schema at an earlier definition instead, which always bottoms
 * out, or give it a body of its own when there is none.
 */
function withConcreteBase(schema, index, ctx) {
  if (typeof schema !== 'object' || schema === null || typeof schema.$ref !== 'string') return schema
  const target = ctx.defNames.indexOf(schema.$ref.replace('#/definitions/', ''))
  if (schema.$ref !== '#' && target < index) return schema
  if (index > 0) return {...schema, $ref: `#/definitions/${ctx.defNames[index - 1]}`}
  const {$ref: _, ...rest} = schema
  return {type: 'number', ...rest}
}

/** Generate a complete root schema for a given seed. */
function generateSchema(seed) {
  const rng = makeRng(seed)
  const ctx = {defNames: [], nodes: 0, maxDepth: 5, maxNodes: 60}

  const root = {$schema: 'http://json-schema.org/draft-07/schema#'}

  // Definitions first, so refs elsewhere have something to point at. Every name is
  // known before any body is generated, so definitions refer to themselves and to
  // each other in both directions: recursive schemas are extremely common in practice.
  const defCount = Math.floor(rng() * 4)
  for (let i = 0; i < defCount; i++) ctx.defNames.push(pick(rng, ['Node', 'Item', 'Base', 'Entity', 'Ref']) + i)
  if (defCount > 0) {
    root.definitions = {}
    ctx.defNames.forEach((name, i) => {
      root.definitions[name] = chance(rng, 0.3)
        ? genTree(rng, ctx, name)
        : withConcreteBase(genSchema(rng, 1, ctx), i, ctx)
    })
  }

  const body = withConcreteBase(genSchema(rng, 0, ctx), defCount, ctx)
  if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
    Object.assign(root, body)
  } else {
    root.type = 'object'
  }
  if (!root.type && !root.allOf && !root.anyOf && !root.oneOf && !root.$ref && !root.enum) {
    root.type = 'object'
  }
  // Definitions are written to be used: an object root refers to about half of them
  // directly, whatever else in the document already does.
  if (root.type === 'object' && !root.$ref && ctx.defNames.length) {
    root.properties = root.properties || {}
    for (const name of ctx.defNames) {
      if (chance(rng, 0.5)) root.properties[name[0].toLowerCase() + name.slice(1)] = refTo(`#/definitions/${name}`, rng)
    }
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
  if (chance(rng, 0.4)) options.inferStringEnumKeysFromValues = true
  if (chance(rng, 0.25)) options.strictIndexSignatures = true
  if (chance(rng, 0.25)) options.unknownAny = false
  if (chance(rng, 0.25)) options.enableConstEnums = false
  if (chance(rng, 0.25)) options.additionalProperties = false
  if (chance(rng, 0.2)) options.ignoreMinAndMaxItems = true
  if (chance(rng, 0.3)) options.maxItems = pick(rng, [-1, 0, 1, 5, 20, 100])
  return options
}

module.exports = {generateSchema, generateOptions, makeRng}
