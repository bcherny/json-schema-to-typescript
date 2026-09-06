/**
 * A `oneOf`/`anyOf`/`allOf` member that is itself an anonymous union or intersection of the
 * same kind is printed as part of the enclosing one, not as a parenthesised group:
 * `"None" | "Zoom" | string`, not `("None" | "Zoom") | string`. Named members keep their name.
 */
export const input = {
  title: 'NestedSetOperations',
  type: 'object',
  definitions: {
    named: {title: 'Named', type: 'string', enum: ['c', 'd']},
    a: {title: 'A', type: 'object', properties: {a: {type: 'string'}}},
    b: {title: 'B', type: 'object', properties: {b: {type: 'string'}}},
    c: {title: 'C', type: 'object', properties: {c: {type: 'string'}}},
  },
  properties: {
    // ARM template style: a fixed vocabulary or an expression string
    enumOrString: {oneOf: [{type: 'string', enum: ['None', 'Zoom', 'AutoFit']}, {type: 'string', pattern: '^\\['}]},
    // OpenAPI 3.0 style nullable enum
    nullableEnum: {type: ['string', 'null'], enum: ['a', 'b', null]},
    // k8s IntOrString style: nullable members of a union
    nullableMembers: {oneOf: [{type: ['string', 'null']}, {type: ['integer', 'null']}]},
    // a named union member stays a reference; the anonymous one beside it is spliced
    namedAndAnonymous: {anyOf: [{$ref: '#/definitions/named'}, {enum: ['e', 'f']}, {type: 'number'}]},
    // three levels deep
    deep: {anyOf: [{anyOf: [{anyOf: [{type: 'string'}, {type: 'boolean'}]}, {type: 'number'}]}, {type: 'null'}]},
    // arrays of a nested union keep the one pair of parentheses they need
    arrayOfNested: {type: 'array', items: {oneOf: [{enum: ['x', 'y']}, {type: 'number'}]}},
    // allOf inside allOf
    nestedAllOf: {
      allOf: [{$ref: '#/definitions/a'}, {allOf: [{$ref: '#/definitions/b'}, {$ref: '#/definitions/c'}]}],
    },
    // a union inside an intersection (different kinds) keeps its parentheses
    unionInIntersection: {
      allOf: [{$ref: '#/definitions/a'}, {oneOf: [{$ref: '#/definitions/b'}, {$ref: '#/definitions/c'}]}],
    },
  },
  additionalProperties: false,
}
