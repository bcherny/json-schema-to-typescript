/**
 * refToNonSchemaValue.array.ts, with the pointer at the root: the ref parser would merge the
 * list's members into the root as keys `0` and `1`, and the whole schema used to compile to
 * `unknown` without complaint.
 */
export const input = {
  $ref: '#/definitions/unit/enum',
  definitions: {
    unit: {type: 'string', enum: ['metres', 'feet']},
  },
}

export const error =
  /\$ref "#\/definitions\/unit\/enum" at the root resolves to an array of 2 items, which is not a JSON Schema/
