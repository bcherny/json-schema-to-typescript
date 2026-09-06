/**
 * Seeded recombinations of JSON-Schema-Test-Suite groups: each suite schema is
 * wrapped (under a property, an array, a $ref, ...) or paired with another, and the
 * suite's instances are carried along wherever their verdict against the new schema
 * follows from their verdict against the old one -- so no validator is needed to
 * referee. This is what catches interaction bugs (a keyword that is handled at the
 * root but not under `items`, say) that the suite's one-keyword-at-a-time groups
 * cannot.
 */

const {makeRng} = require('../fuzz/schemaGen')

// Schemas whose meaning depends on where they sit cannot be re-rooted.
function usable(group) {
  const s = group.schema
  if (typeof s !== 'object' || s === null) return false
  const text = JSON.stringify({...s, $schema: undefined})
  if (/"\$?id"|localhost:1234|\$dynamic|\$recursive|\$anchor|json-schema\.org/.test(text)) return false // base-URI games
  if (/"\$ref":"#"/.test(text)) return false // a root pointer means something else once nested
  if (/"\$ref":"#\/(?!definitions\/|\$defs\/)/.test(text)) return false // so does #/items/0
  return true
}

const defsKey = draft => (draft === 'draft2019-09' || draft === 'draft2020-12' ? '$defs' : 'definitions')

/** Split off `definitions`/`$defs` so they can be hoisted to the new root, with pointers rewritten to match. */
function lift(draft, schema) {
  const body = structuredClone(schema)
  const defs = {...body.definitions, ...body.$defs}
  delete body.definitions
  delete body.$defs
  delete body.$schema
  const rewrite = o => {
    if (!o || typeof o !== 'object') return
    for (const k in o) {
      if (k === '$ref' && typeof o[k] === 'string')
        o[k] = o[k].replace(/^#\/(definitions|\$defs)\//, `#/${defsKey(draft)}/`)
      else rewrite(o[k])
    }
  }
  rewrite(body)
  rewrite(defs)
  return {body, defs}
}

/** Attach the hoisted definitions of every source to `root`; null if two sources define the same name differently. */
function withDefs(draft, root, ...defses) {
  const all = {}
  for (const defs of defses) {
    for (const [k, v] of Object.entries(defs)) {
      if (k in all && JSON.stringify(all[k]) !== JSON.stringify(v)) return null
      all[k] = v
    }
  }
  if (Object.keys(all).length) root[defsKey(draft)] = all
  return root
}

const mapData = (tests, f) => tests.map(t => ({description: t.description, data: f(t.data), valid: t.valid}))

/** kind -> (draft, sources) => {schema, tests} | null. One-source kinds keep every verdict; pairs keep the ones that survive. */
const KINDS = {
  'wrap-properties': (d, [a]) => ({
    schema: withDefs(
      d,
      {type: 'object', properties: {p: a.body}, required: ['p'], additionalProperties: false},
      a.defs,
    ),
    tests: mapData(a.tests, data => ({p: data})),
  }),
  'wrap-items': (d, [a]) => ({
    schema: withDefs(d, {type: 'array', items: a.body}, a.defs),
    tests: [...mapData(a.tests, data => [data]), {description: 'empty array', data: [], valid: true}],
  }),
  'wrap-additionalProperties': (d, [a]) => ({
    schema: withDefs(d, {type: 'object', additionalProperties: a.body}, a.defs),
    tests: [...mapData(a.tests, data => ({x: data})), {description: 'empty object', data: {}, valid: true}],
  }),
  'wrap-ref': (d, [a]) => ({
    schema: withDefs(d, {$ref: `#/${defsKey(d)}/target`}, a.defs, {target: a.body}),
    tests: mapData(a.tests, data => data),
  }),
  'wrap-ref-property': (d, [a]) => ({
    schema: withDefs(d, {type: 'object', properties: {p: {$ref: `#/${defsKey(d)}/target`}}, required: ['p']}, a.defs, {
      target: a.body,
    }),
    tests: mapData(a.tests, data => ({p: data})),
  }),
  'wrap-allOf-single': (d, [a]) => ({
    schema: withDefs(d, {allOf: [a.body]}, a.defs),
    tests: mapData(a.tests, data => data),
  }),
  'nest-properties-items': (d, [a]) => ({
    schema: withDefs(d, {type: 'object', properties: {list: {type: 'array', items: a.body}}}, a.defs),
    tests: mapData(a.tests, data => ({list: [data, data]})),
  }),
  // valid against either member => valid against anyOf; nothing follows for the invalid ones
  'anyOf-pair': (d, [a, b]) => ({
    schema: withDefs(d, {anyOf: [a.body, b.body]}, a.defs, b.defs),
    tests: [...a.tests, ...b.tests]
      .filter(t => t.valid)
      .map(t => ({description: t.description, data: t.data, valid: true})),
  }),
  // invalid against either member => invalid against allOf; nothing follows for the valid ones
  'allOf-pair': (d, [a, b]) => ({
    schema: withDefs(d, {allOf: [a.body, b.body]}, a.defs, b.defs),
    tests: [...a.tests, ...b.tests]
      .filter(t => !t.valid)
      .map(t => ({description: t.description, data: t.data, valid: false})),
  }),
  // {a} is decided by `a` alone; {a, b} is valid exactly when both are
  'properties-two': (d, [a, b]) => {
    const tbs = b.tests
    return {
      schema: withDefs(
        d,
        {type: 'object', properties: {a: a.body, b: b.body}, required: ['a'], additionalProperties: false},
        a.defs,
        b.defs,
      ),
      tests: a.tests.flatMap((ta, i) => {
        const one = {description: ta.description, data: {a: ta.data}, valid: ta.valid}
        if (!tbs.length) return [one]
        const tb = tbs[i % tbs.length]
        const both = {
          description: `${ta.description} + ${tb.description}`,
          data: {a: ta.data, b: tb.data},
          valid: ta.valid && tb.valid,
        }
        return [one, both]
      }),
    }
  },
}

/**
 * @param suite [{draft, file, index, description, schema, tests}] in a stable order
 * @returns [{id, description, schema, tests}], `count` of them (or as many as exist), spread evenly over the drafts
 */
function mutate(suite, {seed, count}) {
  const rnd = makeRng(seed)
  const pick = arr => arr[Math.floor(rnd() * arr.length)]
  const drafts = [...new Set(suite.map(g => g.draft))]
  const kinds = Object.keys(KINDS)
  const out = []
  for (const draft of drafts) {
    const pool = suite.filter(g => g.draft === draft && usable(g)).map(g => ({...g, ...lift(draft, g.schema)}))
    const wanted = Math.ceil(count / drafts.length)
    const seen = new Set()
    for (let made = 0, attempt = 0; made < wanted && attempt < wanted * 20; attempt++) {
      const kind = kinds[attempt % kinds.length]
      const sources = Array.from({length: /pair|two/.test(kind) ? 2 : 1}, () => pick(pool))
      const id = `${draft}/mutation/${kind}(${sources.map(s => `${s.file}#${s.index}`).join(', ')})`
      if (seen.has(id)) continue
      seen.add(id)
      const m = KINDS[kind](draft, sources)
      if (!m.schema || !m.tests.length) continue
      out.push({id, description: sources.map(s => s.description).join(' + '), schema: m.schema, tests: m.tests})
      made++
    }
  }
  return out
}

module.exports = {mutate}
