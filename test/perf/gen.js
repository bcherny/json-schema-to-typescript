/**
 * Perf-fuzz schema generator for json-schema-to-typescript.
 *
 * Unlike test/fuzz/schemaGen.js (a *correctness* fuzzer: random schemas bounded to
 * ~60 nodes), this generator is organised as named FAMILIES of one common real-world
 * shape each, with a single size knob `n`, so the driver can measure how compile()
 * time and memory scale with n and flag super-linear families. `makeRng` is the same
 * mulberry32 as schemaGen's, and the `randomSmall` family delegates to schemaGen when
 * it is next door (in-repo); everything is deterministic from (family, n, seed).
 *
 * Each family: (n, rng) => { schema, files?, options?, note }
 *   files   — extra JSON documents to write next to the root (external $ref families);
 *             keys are relative paths, the driver writes them into a temp dir = cwd.
 *   options — compile() options the shape needs (e.g. unreachableDefinitions).
 */

// mulberry32 (same as test/fuzz/schemaGen.js)
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

const PRIMS = ['string', 'number', 'integer', 'boolean']
const WORDS = ['id', 'name', 'type', 'value', 'status', 'createdAt', 'updated_at', 'url', 'email', 'count', 'enabled', 'tags', 'owner', 'meta', 'kind', 'version']
const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

function prim(rng, i) {
  return {type: PRIMS[(i + Math.floor(rng() * 4)) % 4]}
}
function propName(i) {
  return `${WORDS[i % WORDS.length]}${i >= WORDS.length ? Math.floor(i / WORDS.length) : ''}`
}
/** a small realistic leaf object: k primitive props, some required, optional description */
function smallObject(rng, k = 3, extra = {}) {
  const properties = {}
  const required = []
  for (let i = 0; i < k; i++) {
    const key = propName(i + Math.floor(rng() * 5))
    properties[key] = prim(rng, i)
    if (rng() < 0.5) required.push(key)
  }
  return {type: 'object', properties, required, additionalProperties: false, ...extra}
}

const FAMILIES = {}
const META = {}
function family(name, meta, fn) {
  FAMILIES[name] = fn
  META[name] = {cap: 100000, ...meta}
}

// ───────────────────────────── depth ─────────────────────────────
family('deepProperties', {desc: 'object nested n levels via properties'}, (n, rng) => {
  let s = smallObject(rng, 2)
  for (let i = 0; i < n; i++) s = {type: 'object', properties: {[propName(i)]: s, leaf: {type: 'string'}}, additionalProperties: false}
  return {schema: s}
})
family('deepItems', {desc: 'array nested n levels via items'}, (n, rng) => {
  let s = smallObject(rng, 2)
  for (let i = 0; i < n; i++) s = {type: 'array', items: s}
  return {schema: {type: 'object', properties: {matrix: s}}}
})
family('deepDefinitionChain', {desc: 'D0 -> D1 -> … -> Dn chain of $ref-only definitions'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) definitions[`D${i}`] = {$ref: `#/definitions/D${i + 1}`}
  definitions[`D${n}`] = smallObject(rng, 3, {title: 'Leaf'})
  return {schema: {type: 'object', properties: {start: {$ref: '#/definitions/D0'}}, definitions}}
})
family('deepDefinitionObjects', {desc: 'D0.child -> D1.child -> … (each level a titled object)'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++)
    definitions[`Level${i}`] = {
      type: 'object',
      title: `Level${i}`,
      properties: {child: {$ref: `#/definitions/Level${i + 1}`}, [propName(i)]: prim(rng, i)},
      additionalProperties: false,
    }
  definitions[`Level${n}`] = smallObject(rng, 2, {title: `Level${n}`})
  return {schema: {type: 'object', properties: {root: {$ref: '#/definitions/Level0'}}, definitions}}
})
family('deepAllOf', {desc: 'allOf:[{props}, {allOf:[…]}] nested n levels (inheritance chains)'}, (n, rng) => {
  let s = smallObject(rng, 2)
  for (let i = 0; i < n; i++) s = {allOf: [smallObject(rng, 1), s]}
  return {schema: {type: 'object', properties: {v: s}}}
})
family('deepAnyOf', {desc: 'anyOf:[leaf, {anyOf:[…]}] nested n levels'}, (n, rng) => {
  let s = prim(rng, 0)
  for (let i = 0; i < n; i++) s = {anyOf: [smallObject(rng, 1), s]}
  return {schema: {type: 'object', properties: {v: s}}}
})

// ───────────────────────────── width ─────────────────────────────
family('wideProperties', {desc: 'one object with n primitive properties'}, (n, rng) => {
  const properties = {}
  const required = []
  for (let i = 0; i < n; i++) {
    properties[propName(i)] = {...prim(rng, i), description: rng() < 0.3 ? LOREM.slice(0, 40) : undefined}
    if (i % 2) required.push(propName(i))
  }
  return {schema: {type: 'object', properties, required, additionalProperties: false}}
})
family('wideNestedObjects', {desc: 'n properties, each an anonymous inline object (3 props)'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = smallObject(rng, 3)
  return {schema: {type: 'object', properties, additionalProperties: false}}
})
family('wideRequiredOnly', {desc: 'n properties all listed in required (required.includes per key)'}, (n, rng) => {
  const properties = {}
  const required = []
  for (let i = 0; i < n; i++) {
    properties[propName(i)] = prim(rng, i)
    required.push(propName(i))
  }
  return {schema: {type: 'object', properties, required}}
})
family('wideNullableTypeArray', {desc: 'n properties each type:[T,"null"] (nullable columns)'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {type: [PRIMS[i % 4], 'null'], description: i % 3 ? undefined : 'nullable field'}
  return {schema: {type: 'object', properties, additionalProperties: false}}
})
family('wideOpenApiNullable', {desc: 'n properties each {type, nullable:true} (OpenAPI 3.0)'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {type: PRIMS[i % 4], nullable: true}
  return {schema: {type: 'object', properties}}
})
family('wideTitledProperties', {desc: 'n properties each with a distinct title (n named type aliases)'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {...prim(rng, i), title: `Field ${propName(i)}`}
  return {schema: {type: 'object', title: 'Row', properties}}
})

// ───────────────────────────── definitions / refs ─────────────────────────────
family('manyDefinitionsEachUsed', {desc: 'n definitions, each $ref’d once from root properties'}, (n, rng) => {
  const definitions = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    definitions[`Def${i}`] = smallObject(rng, 3)
    properties[propName(i)] = {$ref: `#/definitions/Def${i}`}
  }
  return {schema: {type: 'object', properties, definitions}}
})
family('manyDefinitionsUnreachable', {desc: 'n definitions, none referenced, unreachableDefinitions:true (the “generate all my models” use)'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) definitions[`Model${i}`] = smallObject(rng, 4)
  return {schema: {definitions}, options: {unreachableDefinitions: true}}
})
family('manyDefinitionsInterlinked', {desc: 'n definitions; Def_i has 3 props $ref’ing random earlier defs + unreachableDefinitions'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) {
    const o = smallObject(rng, 2)
    for (let k = 0; k < 3 && i > 0; k++) o.properties[`rel${k}`] = {$ref: `#/definitions/Def${Math.floor(rng() * i)}`}
    if (i > 0 && rng() < 0.3) o.properties.list = {type: 'array', items: {$ref: `#/definitions/Def${Math.floor(rng() * i)}`}}
    definitions[`Def${i}`] = o
  }
  return {schema: {type: 'object', properties: {root: {$ref: `#/definitions/Def${n - 1}`}}, definitions}, options: {unreachableDefinitions: true}}
})
family('manyRefsToOneDefinition', {desc: 'n properties all $ref the same definition'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {$ref: '#/definitions/Shared'}
  return {schema: {type: 'object', properties, definitions: {Shared: smallObject(rng, 3, {title: 'Shared'})}}}
})
family('manyRefsWithSiblingDescription', {desc: 'n properties {$ref, description} (OpenAPI style $ref + sibling)'}, (n, rng) => {
  const properties = {}
  const definitions = {}
  for (let i = 0; i < 10; i++) definitions[`T${i}`] = smallObject(rng, 3)
  for (let i = 0; i < n; i++) properties[propName(i)] = {$ref: `#/definitions/T${i % 10}`, description: `Field ${i} ${LOREM.slice(0, 30)}`}
  return {schema: {type: 'object', properties, definitions}}
})
family('externalRefFiles', {desc: 'n sibling files, root $ref’s each ./defs/dK.json'}, (n, rng) => {
  const files = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    files[`defs/d${i}.json`] = smallObject(rng, 3, {title: `External${i}`})
    properties[propName(i)] = {$ref: `defs/d${i}.json`}
  }
  return {schema: {type: 'object', properties}, files}
})
family('externalRefOneFileManyPointers', {desc: 'one external file with n definitions; root has n $refs into it (common.json#/definitions/X)'}, (n, rng) => {
  const definitions = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    definitions[`C${i}`] = smallObject(rng, 2)
    properties[propName(i)] = {$ref: `common.json#/definitions/C${i}`}
  }
  return {schema: {type: 'object', properties}, files: {'common.json': {definitions}}}
})
family('externalRefChain', {desc: 'f0.json -> f1.json -> … -> fn.json (each file refs the next)'}, (n, rng) => {
  const files = {}
  for (let i = 0; i < n; i++) files[`f${i}.json`] = {type: 'object', title: `F${i}`, properties: {next: {$ref: `f${i + 1}.json`}, v: prim(rng, i)}}
  files[`f${n}.json`] = smallObject(rng, 2, {title: `F${n}`})
  return {schema: {type: 'object', properties: {head: {$ref: 'f0.json'}}}, files}
})

// ───────────────────────────── combinators ─────────────────────────────
family('allOfFanout', {desc: 'allOf with n inline object members'}, (n, rng) => {
  return {schema: {type: 'object', properties: {v: {allOf: Array.from({length: n}, () => smallObject(rng, 2))}}}}
})
family('allOfRefsFanout', {desc: 'allOf with n $ref members (mixins)'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) definitions[`Mixin${i}`] = smallObject(rng, 2)
  return {schema: {title: 'Combined', allOf: Array.from({length: n}, (_, i) => ({$ref: `#/definitions/Mixin${i}`})), definitions}}
})
family('anyOfInlineObjects', {desc: 'anyOf with n inline object members'}, (n, rng) => {
  return {schema: {type: 'object', properties: {v: {anyOf: Array.from({length: n}, () => smallObject(rng, 3))}}}}
})
family('oneOfRefs', {desc: 'oneOf with n $ref members to named definitions (tagged union of models)'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++)
    definitions[`Variant${i}`] = {
      type: 'object',
      properties: {kind: {type: 'string', enum: [`v${i}`]}, ...smallObject(rng, 2).properties},
      required: ['kind'],
      additionalProperties: false,
    }
  return {schema: {title: 'Event', oneOf: Array.from({length: n}, (_, i) => ({$ref: `#/definitions/Variant${i}`})), definitions}}
})
family('oneOfConst', {desc: 'oneOf n {const, title} members (documented enum alternative)'}, (n, rng) => {
  return {schema: {type: 'object', properties: {code: {oneOf: Array.from({length: n}, (_, i) => ({const: `CODE_${i}`, title: `Code ${i}`, description: `Meaning of code ${i}`}))}}}}
})
family('oneOfConstUntitled', {desc: 'oneOf n {const} members, no titles'}, (n, rng) => {
  return {schema: {type: 'object', properties: {code: {oneOf: Array.from({length: n}, (_, i) => ({const: `CODE_${i}`}))}}}}
})
family('anyOfIdenticalMembers', {desc: 'anyOf n structurally identical inline objects (optimizer dedupe)'}, (n, rng) => {
  const member = () => ({type: 'object', properties: {a: {type: 'string'}, b: {type: 'number'}}, required: ['a'], additionalProperties: false})
  return {schema: {type: 'object', properties: {v: {anyOf: Array.from({length: n}, member)}}}}
})
family('anyOfNestedWidth', {desc: 'anyOf of n members, each an anyOf of n primitives/objects (n² leaves)', cap: 400}, (n, rng) => {
  return {
    schema: {
      type: 'object',
      properties: {v: {anyOf: Array.from({length: n}, (_, i) => ({anyOf: Array.from({length: n}, (_, j) => ((i + j) % 3 ? prim(rng, j) : smallObject(rng, 1)))}))}},
    },
  }
})
family('allOfWithPropertiesSibling', {desc: 'n definitions each {properties, allOf:[$ref Base]} (class extends Base)'}, (n, rng) => {
  const definitions = {Base: smallObject(rng, 3, {title: 'Base'})}
  const properties = {}
  for (let i = 0; i < n; i++) {
    definitions[`Sub${i}`] = {...smallObject(rng, 2), allOf: [{$ref: '#/definitions/Base'}]}
    properties[propName(i)] = {$ref: `#/definitions/Sub${i}`}
  }
  return {schema: {type: 'object', properties, definitions}}
})
family('discriminatedUnionInArray', {desc: 'items: oneOf n refs, each variant allOf:[Base,{props}] (k8s / event-log style)'}, (n, rng) => {
  const definitions = {Base: {type: 'object', properties: {id: {type: 'string'}, kind: {type: 'string'}}, required: ['id', 'kind']}}
  for (let i = 0; i < n; i++) definitions[`V${i}`] = {allOf: [{$ref: '#/definitions/Base'}, {type: 'object', properties: {kind: {const: `k${i}`}, [propName(i)]: prim(rng, i)}}]}
  return {schema: {type: 'object', properties: {events: {type: 'array', items: {oneOf: Array.from({length: n}, (_, i) => ({$ref: `#/definitions/V${i}`}))}}}, definitions}}
})

// ───────────────────────────── enums ─────────────────────────────
family('stringEnum', {desc: 'enum of n strings (union of literals)'}, (n, rng) => ({schema: {type: 'object', properties: {country: {type: 'string', enum: Array.from({length: n}, (_, i) => `VALUE_${i}`)}}}}))
family('stringEnumTitled', {desc: 'titled enum of n strings (TS enum)'}, (n, rng) => ({schema: {type: 'object', properties: {country: {title: 'Country', type: 'string', enum: Array.from({length: n}, (_, i) => `VALUE_${i}`)}}}}))
family('stringEnumTsEnumNames', {desc: 'titled enum of n strings + tsEnumNames'}, (n, rng) => ({
  schema: {type: 'object', properties: {country: {title: 'Country', type: 'string', enum: Array.from({length: n}, (_, i) => `value-${i}`), tsEnumNames: Array.from({length: n}, (_, i) => `Value${i}`)}}},
}))
family('stringEnumInferKeys', {desc: 'titled enum of n strings, inferStringEnumKeysFromValues'}, (n, rng) => ({
  schema: {type: 'object', properties: {country: {title: 'Country', type: 'string', enum: Array.from({length: n}, (_, i) => `VALUE_${i}`)}}},
  options: {inferStringEnumKeysFromValues: true},
}))
family('numberEnumTitled', {desc: 'titled enum of n integers'}, (n, rng) => ({schema: {type: 'object', properties: {code: {title: 'Code', type: 'integer', enum: Array.from({length: n}, (_, i) => i * 3)}}}}))
family('manySmallNamedEnums', {desc: 'n properties, each a titled 4-member string enum'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {title: `Enum${i}`, type: 'string', enum: ['a', 'b', 'c', `d${i}`]}
  return {schema: {type: 'object', properties}}
})
family('enumWithDuplicates', {desc: 'enum of n strings with 50% duplicates'}, (n, rng) => ({schema: {type: 'object', properties: {v: {enum: Array.from({length: n}, (_, i) => `V${i % Math.ceil(n / 2)}`)}}}}))

// ───────────────────────────── patternProperties / additionalProperties ─────────────────────────────
family('patternPropertiesMany', {desc: 'n patternProperties entries'}, (n, rng) => {
  const patternProperties = {}
  for (let i = 0; i < n; i++) patternProperties[`^x-${propName(i)}-[a-z]+$`] = i % 2 ? prim(rng, i) : smallObject(rng, 2)
  return {schema: {type: 'object', patternProperties, additionalProperties: false}}
})
family('patternPlusPropsPlusAdditional', {desc: 'n properties + 2 patternProperties + additionalProperties schema'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = prim(rng, i)
  return {schema: {type: 'object', properties, patternProperties: {'^x-': {}, '^_': {type: 'string'}}, additionalProperties: smallObject(rng, 2)}}
})
family('additionalPropertiesFalseEverywhere', {desc: 'n nested inline objects all additionalProperties:false + strictIndexSignatures'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {type: 'object', properties: {m: {type: 'object', additionalProperties: {type: 'string'}}}, additionalProperties: false}
  return {schema: {type: 'object', properties, additionalProperties: false}, options: {strictIndexSignatures: true}}
})

// ───────────────────────────── cycles ─────────────────────────────
family('cyclicRing', {desc: 'n definitions in a ring: D_k.next -> D_{k+1 mod n}'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) definitions[`Node${i}`] = {type: 'object', properties: {next: {$ref: `#/definitions/Node${(i + 1) % n}`}, v: prim(rng, i)}, additionalProperties: false}
  return {schema: {type: 'object', properties: {head: {$ref: '#/definitions/Node0'}}, definitions}}
})
family('selfRecursiveTrees', {desc: 'n definitions each with children: array of itself'}, (n, rng) => {
  const definitions = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    definitions[`Tree${i}`] = {type: 'object', properties: {value: prim(rng, i), children: {type: 'array', items: {$ref: `#/definitions/Tree${i}`}}}}
    properties[propName(i)] = {$ref: `#/definitions/Tree${i}`}
  }
  return {schema: {type: 'object', properties, definitions}}
})
family('mutualRecursionPairs', {desc: 'n pairs A_k <-> B_k'}, (n, rng) => {
  const definitions = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    definitions[`A${i}`] = {type: 'object', properties: {b: {$ref: `#/definitions/B${i}`}, v: prim(rng, i)}}
    definitions[`B${i}`] = {type: 'object', properties: {a: {$ref: `#/definitions/A${i}`}, list: {type: 'array', items: {$ref: `#/definitions/A${i}`}}}}
    properties[propName(i)] = {$ref: `#/definitions/A${i}`}
  }
  return {schema: {type: 'object', properties, definitions}}
})
family('denseCyclicGraph', {desc: 'n definitions, each refs 4 random others (cyclic graph, JSON:API / GraphQL-ish)'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) {
    const properties = {id: {type: 'string'}}
    for (let k = 0; k < 4; k++) properties[`rel${k}`] = {$ref: `#/definitions/E${Math.floor(rng() * n)}`}
    definitions[`E${i}`] = {type: 'object', properties, required: ['id']}
  }
  return {schema: {type: 'object', properties: {data: {$ref: '#/definitions/E0'}}, definitions}, options: {unreachableDefinitions: true}}
})
family('anonymousCycleViaExternal', {desc: 'root <-> other.json cycle through n intermediate files', cap: 200}, (n, rng) => {
  const files = {}
  for (let i = 0; i < n; i++) files[`c${i}.json`] = {type: 'object', title: `C${i}`, properties: {next: {$ref: i + 1 < n ? `c${i + 1}.json` : 'root.json'}}}
  return {schema: {$id: 'root.json', title: 'Root', type: 'object', properties: {first: {$ref: n ? 'c0.json' : 'root.json'}}}, files, rootFile: 'root.json'}
})

// ───────────────────────────── naming ─────────────────────────────
family('duplicateTitles', {desc: 'n inline objects all titled "Item" (name dedupe counter)'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = smallObject(rng, 2, {title: 'Item'})
  return {schema: {type: 'object', properties}}
})
family('duplicateDefinitionNamesAcrossFiles', {desc: 'n external files each defining a "Item"-titled schema'}, (n, rng) => {
  const files = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    files[`m${i}/item.json`] = smallObject(rng, 2, {title: 'Item'})
    properties[propName(i)] = {$ref: `m${i}/item.json`}
  }
  return {schema: {type: 'object', properties}, files}
})
family('sameKeyManyLevels', {desc: 'property "data" nested n times (Data, Data1, Data2 …)'}, (n, rng) => {
  let s = smallObject(rng, 1)
  for (let i = 0; i < n; i++) s = {type: 'object', properties: {data: s}}
  return {schema: s}
})

// ───────────────────────────── text ─────────────────────────────
family('longDescriptions', {desc: 'n properties each with a 2 kB multi-line description'}, (n, rng) => {
  const properties = {}
  const para = (LOREM + '\n\n- bullet `code` */ tricky\n').repeat(8)
  for (let i = 0; i < n; i++) properties[propName(i)] = {...prim(rng, i), description: para}
  return {schema: {type: 'object', properties}}
})
family('hugeDescription', {desc: 'one property whose description is n × 1 kB'}, (n, rng) => {
  return {schema: {type: 'object', properties: {v: {type: 'string', description: (LOREM.repeat(4) + '\n').repeat(n)}}}}
})

// ───────────────────────────── arrays / tuples ─────────────────────────────
family('tupleMinItemsOnly', {desc: 'array of objects with minItems:n, no maxItems (tuple of n + spread)'}, (n, rng) => ({schema: {type: 'object', properties: {v: {type: 'array', items: smallObject(rng, 3), minItems: n}}}}))
family('tupleMinMaxNarrow', {desc: 'minItems:n maxItems:n+5 (passes the maxItems>20 guard; union of 6 tuples ~n long)'}, (n, rng) => ({schema: {type: 'object', properties: {v: {type: 'array', items: smallObject(rng, 3), minItems: n, maxItems: n + 5}}}}))
family('manyBoundedArrays', {desc: 'n properties each array minItems:1 maxItems:3'}, (n, rng) => {
  const properties = {}
  for (let i = 0; i < n; i++) properties[propName(i)] = {type: 'array', items: prim(rng, i), minItems: 1, maxItems: 3}
  return {schema: {type: 'object', properties}}
})
family('explicitTupleWide', {desc: 'items: [n schemas] (explicit tuple)'}, (n, rng) => ({schema: {type: 'object', properties: {row: {type: 'array', items: Array.from({length: n}, (_, i) => prim(rng, i))}}}}))

// ───────────────────────────── OpenAPI-ish documents ─────────────────────────────
family('openapiComponents', {desc: 'OpenAPI 3 doc: n component schemas (refs #/components/schemas/X, nullable, allOf) compiled via root properties → each component'}, (n, rng) => {
  const schemas = {}
  const properties = {}
  for (let i = 0; i < n; i++) {
    const o = smallObject(rng, 4)
    o.properties.parent = i ? {$ref: `#/components/schemas/Model${Math.floor(rng() * i)}`} : {type: 'string', nullable: true}
    o.properties.note = {type: 'string', nullable: true, description: LOREM.slice(0, 50)}
    if (i > 2 && i % 5 === 0) schemas[`Model${i}`] = {allOf: [{$ref: `#/components/schemas/Model${i - 1}`}, o], description: `Model ${i}`}
    else schemas[`Model${i}`] = o
    properties[`Model${i}`] = {$ref: `#/components/schemas/Model${i}`}
  }
  return {schema: {openapi: '3.0.3', info: {title: 'x', version: '1'}, paths: {}, components: {schemas}, type: 'object', properties}}
})
family('swagger2Definitions', {desc: 'Swagger 2 style: n definitions with refs, compiled whole with unreachableDefinitions (k8s swagger.json use)'}, (n, rng) => {
  const definitions = {}
  for (let i = 0; i < n; i++) {
    const o = smallObject(rng, 5)
    o.description = `io.example.v1.Model${i} ${LOREM.slice(0, 60)}`
    if (i) o.properties.spec = {$ref: `#/definitions/io.example.v1.Model${Math.floor(rng() * i)}`, description: 'spec ref'}
    o.properties.items = {type: 'array', items: {$ref: `#/definitions/io.example.v1.Model${Math.floor(rng() * (i + 1))}`}}
    o.properties.labels = {type: 'object', additionalProperties: {type: 'string'}}
    definitions[`io.example.v1.Model${i}`] = o
  }
  return {schema: {swagger: '2.0', info: {title: 'x', version: '1'}, paths: {}, definitions}, options: {unreachableDefinitions: true}}
})

// ───────────────────────────── mixed realistic ─────────────────────────────
family('realisticMixed', {desc: 'n definitions mixing enums, nullable, arrays of refs, allOf base, descriptions (typical app schema)'}, (n, rng) => {
  const definitions = {BaseEntity: {type: 'object', properties: {id: {type: 'string', format: 'uuid'}, createdAt: {type: 'string', format: 'date-time'}}, required: ['id']}}
  const properties = {}
  for (let i = 0; i < n; i++) {
    const o = smallObject(rng, 4)
    o.properties.status = {type: 'string', enum: ['active', 'inactive', 'pending'], description: 'Status'}
    o.properties.tags = {type: 'array', items: {type: 'string'}}
    o.properties.owner = i ? {$ref: `#/definitions/Entity${Math.floor(rng() * i)}`} : {type: 'null'}
    o.properties.maybe = {type: ['string', 'null']}
    definitions[`Entity${i}`] = {description: `Entity ${i}. ${LOREM.slice(0, 80)}`, allOf: [{$ref: '#/definitions/BaseEntity'}, o]}
    properties[propName(i)] = {$ref: `#/definitions/Entity${i}`}
  }
  return {schema: {title: 'Api', type: 'object', properties, definitions}}
})

// test/fuzz's random generator as a size-independent sanity family (n = its seed). Falls
// back to a tiny inline generator when this file is used outside the repo.
let schemaGen = null
try {
  schemaGen = require('../fuzz/schemaGen')
} catch (_) {}
family('randomSmall', {desc: 'random bounded schema from test/fuzz/schemaGen.js (n used as seed; not a scaling family)', scaling: false}, (n, rng) => {
  if (schemaGen) return {schema: schemaGen.generateSchema(n), options: {$refOptions: {resolve: {file: false, http: false}}}}
  const defNames = []
  function gen(d) {
    if (d > 4) return prim(rng, 0)
    const r = rng()
    if (r < 0.3) return prim(rng, d)
    if (r < 0.5) return {type: 'object', properties: Object.fromEntries(Array.from({length: 1 + Math.floor(rng() * 4)}, (_, i) => [propName(i), gen(d + 1)]))}
    if (r < 0.65) return {type: 'array', items: gen(d + 1), minItems: Math.floor(rng() * 3)}
    if (r < 0.8) return {[pick(rng, ['allOf', 'anyOf', 'oneOf'])]: [gen(d + 1), gen(d + 1)]}
    if (r < 0.9 && defNames.length) return {$ref: `#/definitions/${pick(rng, defNames)}`}
    return {enum: ['a', 'b', 1, null].slice(0, 1 + Math.floor(rng() * 4))}
  }
  const definitions = {}
  for (let i = 0; i < 3; i++) {
    defNames.push(`Def${i}`)
    definitions[`Def${i}`] = gen(1)
  }
  const root = gen(0)
  return {schema: {definitions, ...(root.type === 'object' ? root : {type: 'object', properties: {root}})}}
})

function generate(familyName, n, seed = 1) {
  const fn = FAMILIES[familyName]
  if (!fn) throw new Error(`unknown family ${familyName}; known: ${Object.keys(FAMILIES).join(', ')}`)
  const rng = makeRng((seed * 2654435761) ^ (n * 40503) ^ hash(familyName))
  return {...fn(n, rng), family: familyName, n, seed}
}
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

module.exports = {FAMILIES, META, generate, makeRng}

if (require.main === module) {
  const [fam, n = '3', seed = '1'] = process.argv.slice(2)
  if (!fam) {
    for (const [k, m] of Object.entries(META)) console.log(`${k.padEnd(36)} ${m.desc}`)
  } else {
    process.stdout.write(JSON.stringify(generate(fam, Number(n), Number(seed)), null, 2) + '\n')
  }
}
