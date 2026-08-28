// https://github.com/bcherny/json-schema-to-typescript/issues/395
// `required` next to `allOf`/`anyOf`/`oneOf` whose members hold the properties (see also
// allOfRefWithSiblingRequired.ts, the issue's own schema, and required.ts, the member form):
// the points raised on https://github.com/bcherny/json-schema-to-typescript/pull/408 --
// anyOf/oneOf, nesting, a definition referenced both with and without a sibling `required` --
// plus undeclared keys, several members, own properties next to the ref, and recursion.
const thing = {$ref: '#/definitions/thing'}
const other = {$ref: '#/definitions/other'}
export const input = {
  title: 'RequiredNextToRef',
  type: 'object',
  additionalProperties: false,
  properties: {
    // the same definition with no, one, and another sibling `required`: declared once, all optional
    plain: thing,
    withRequired: {allOf: [thing], required: ['a']},
    withOtherRequired: {allOf: [thing], required: ['b', 'a']},
    // a key nothing declares is skipped, like everywhere else; nothing declared, nothing added
    partlyUndeclared: {allOf: [thing], required: ['zzz', 'a']},
    onlyUndeclared: {allOf: [thing], required: ['zzz']},
    // each key from whichever member declares it
    twoMembers: {allOf: [thing, other], required: ['a', 'x']},
    // anyOf/oneOf: required in each branch that declares it, with that branch's type
    anyOf: {anyOf: [thing, other], required: ['a']},
    oneOf: {oneOf: [thing, {$ref: '#/definitions/numeric'}], required: ['a']},
    // the declaration is two (inline) or three (through another definition) levels down
    nested: {allOf: [{allOf: [thing]}], required: ['a']},
    nestedRef: {allOf: [{$ref: '#/definitions/extended'}], required: ['a', 'e']},
    // own properties, plus a key only the ref declares
    mixed: {
      type: 'object',
      properties: {own: {type: 'boolean'}},
      required: ['own', 'a'],
      allOf: [thing],
      additionalProperties: false,
    },
    mixedOneOf: {
      type: 'object',
      properties: {own: {type: 'boolean'}},
      required: ['own', 'a'],
      oneOf: [thing, other],
      additionalProperties: false,
    },
    // recursive definitions, required into from outside and from inside the cycle
    tree: {allOf: [{$ref: '#/definitions/node'}], required: ['children']},
    list: {$ref: '#/definitions/item'},
  },
  definitions: {
    thing: {type: 'object', properties: {a: {type: 'string'}, b: {type: 'integer'}}},
    other: {type: 'object', properties: {x: {type: 'string'}}},
    numeric: {type: 'object', properties: {a: {type: 'number'}}},
    extended: {allOf: [thing, {type: 'object', properties: {e: {type: 'string'}}}]},
    node: {
      type: 'object',
      properties: {value: {type: 'string'}, children: {type: 'array', items: {$ref: '#/definitions/node'}}},
    },
    item: {
      type: 'object',
      properties: {value: {type: 'string'}, next: {allOf: [{$ref: '#/definitions/item'}], required: ['value']}},
    },
  },
}
