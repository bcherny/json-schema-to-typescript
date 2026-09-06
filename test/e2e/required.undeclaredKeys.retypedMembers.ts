/**
 * Where a member of a set operation borrows the declaration of a key it requires but doesn't
 * declare (see required.undeclaredKeys.ts), around members the normalizer or the parser retypes:
 * - `retyped`: the `anyOf` member admits objects and strings under an object-only owner, so the
 *   normalizer narrows it to `object` (a retyped copy takes its place). The member of *its* `anyOf`
 *   borrows `b` from it and `a` from the owner, as it would had the member said `object` itself.
 * - `perType`: the owner admits `null` and objects, so the parser renders it one type at a time,
 *   from per-type copies that share the `anyOf` member. The member is parsed once for all of them,
 *   so it borrows from none: `a` stays `unknown` whichever type is listed first.
 * - `perTypeExtends`: the same kind of owner, requiring a key only the schema it `extends` (draft 3)
 *   declares. Each per-type copy still finds it for the intersection it is rendered as
 *   (`{x: string} & (…)`), members shared or not.
 */
export const input = {
  type: 'object',
  properties: {
    retyped: {
      type: 'object',
      properties: {a: {type: 'string'}},
      anyOf: [
        {
          type: ['object', 'string'],
          properties: {b: {type: 'number'}},
          anyOf: [{properties: {c: {type: 'boolean'}}, required: ['a', 'b', 'c']}],
        },
      ],
    },
    perType: {
      type: ['null', 'object'],
      properties: {a: {type: 'string'}},
      additionalProperties: false,
      anyOf: [{properties: {b: {type: 'number'}}, required: ['a', 'b']}],
    },
    perTypeExtends: {
      type: ['object', 'null'],
      extends: {properties: {x: {type: 'string'}}},
      properties: {p: {type: 'string'}},
      required: ['x'],
      anyOf: [{properties: {a: {type: 'number'}}}, {properties: {b: {type: 'boolean'}}}],
    },
  },
  additionalProperties: false,
}
