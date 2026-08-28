/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/513
 * The corners of the required-only member rule (see anyOfWithRequiredOnlyMembers.ts for the
 * plain case), on an open parent that has `required` keys of its own -- the shape of the
 * OpenAPI 3.1 meta-schema's root:
 * - `anyOf`: a picked property that is a named type (`B`) is declared once and referenced from
 *   both the pick and the parent interface.
 * - `oneOf` member 1: `type: 'object'` next to `required` doesn't change anything; `notDeclared`
 *   isn't one of the parent's `properties`, so it is required as `unknown`, like everywhere else; a
 *   key listed twice (invalid, but tolerated everywhere else) is picked once.
 * - `oneOf` member 2: nothing it lists is declared, so `unknown` is all there is to pick.
 * - `oneOf` member 3: says something other than `required`, so it is parsed on its own.
 */
export const input = {
  title: 'RequiredOnlyMembers',
  type: 'object',
  properties: {
    a: {type: 'string'},
    b: {title: 'B', type: 'object', properties: {x: {type: 'number'}}},
    c: {type: 'boolean'},
  },
  required: ['a'],
  anyOf: [{required: ['b']}, {required: ['c']}],
  oneOf: [
    {type: 'object', required: ['b', 'notDeclared', 'b']},
    {required: ['notDeclared'], description: 'Nothing to pick here'},
    {not: {required: ['b']}},
  ],
}
