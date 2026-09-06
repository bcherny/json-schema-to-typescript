/**
 * refToNonSchemaValue.ts, with the `$ref` at the root: the whole schema would be the string
 * `"metres"`. (The ref-parser, following the root's own `$ref` while walking the pointer's tokens,
 * used to report the pointer as missing -- "Token "definitions" does not exist" -- when it is not.)
 */
export const input = {
  $ref: '#/definitions/unit/default',
  definitions: {
    unit: {type: 'string', default: 'metres'},
  },
}

export const error =
  /\$ref "#\/definitions\/unit\/default" at the root resolves to the string "metres", which is not a JSON Schema/
