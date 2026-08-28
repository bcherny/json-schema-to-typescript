/**
 * A `tsType` (or `formatTypes`) string is emitted verbatim. Where it becomes part of a larger
 * type -- an array element, a union or intersection member -- anything that is not a plain type
 * reference is parenthesized so it keeps its meaning: `(() => void)[]`, not `() => void[]`.
 */
export const input = {
  title: 'Composed',
  type: 'object',
  additionalProperties: false,
  definitions: {
    handler: {tsType: '(value: string) => void', title: 'Handler'},
  },
  properties: {
    // array elements that need the parentheses
    functions: {type: 'array', items: {tsType: '() => void'}},
    keys: {type: 'array', items: {tsType: 'keyof Date'}},
    typeofs: {type: 'array', items: {tsType: 'typeof NaN'}},
    unions: {type: 'array', items: {tsType: 'string | number'}},
    conditionals: {type: 'array', items: {tsType: 'Date extends object ? 1 : 2'}},
    constructors: {type: 'array', items: {tsType: 'new () => Date'}},
    readonlyFunctions: {type: 'array', items: {tsType: '() => void'}, readOnly: true},
    formatted: {type: 'array', items: {type: 'string', format: 'date-time'}},
    // a one-member anyOf/oneOf is transparent: its member is still the array element
    unionInOneMemberAnyOf: {type: 'array', items: {anyOf: [{tsType: 'Date | RegExp'}]}},
    // a trailing line comment must not swallow the closing parenthesis
    commented: {type: 'array', items: {tsType: 'Date // as returned by the API'}},
    // array elements that are one operand already: a name, a qualified name or a one-level generic is
    // printed as written; anything else gets a pair of parentheses the formatter drops again
    names: {type: 'array', items: {tsType: 'Date'}},
    qualified: {type: 'array', items: {tsType: 'Intl.NumberFormat'}},
    generics: {type: 'array', items: {tsType: 'Map<string, Array<number>>'}},
    arrays: {type: 'array', items: {tsType: 'Date[]'}},
    objects: {type: 'array', items: {tsType: '{a: string}'}},
    named: {type: 'array', items: {$ref: '#/definitions/handler'}},
    // tuple members are whole types; the rest element is parenthesized as before
    tuple: {
      type: 'array',
      minItems: 2,
      items: [{tsType: '() => void'}, {tsType: 'string | number'}],
      additionalItems: {tsType: '() => void'},
    },
    // set-operation members
    functionOrNull: {anyOf: [{tsType: '(x: number) => string'}, {type: 'null'}]},
    unionOfNamesOrNull: {anyOf: [{tsType: 'Date | RegExp'}, {type: 'null'}]},
    unionAndEnum: {allOf: [{tsType: 'string | number'}, {enum: ['a', 1]}]},
    unionInOneMemberAnyOfAndEnum: {allOf: [{anyOf: [{tsType: 'string | number'}]}, {enum: ['a', 1]}]},
    commentedFunctionOrNull: {anyOf: [{tsType: '(x: number) => string // sync'}, {type: 'null'}]},
    formattedOrNull: {anyOf: [{type: 'string', format: 'date-time'}, {type: 'null'}]},
  },
}

export const options = {
  formatTypes: {'date-time': 'Date | string'},
  readonlyKeyword: true,
}
