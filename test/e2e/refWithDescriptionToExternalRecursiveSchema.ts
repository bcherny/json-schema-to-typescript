/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/614
 * oneOfRefToExternalRecursiveSchema.ts with a `description` next to the `$ref`: the
 * property gets the resolver's annotated copy of RecursiveOneOf.json, and the file's
 * own root -- which the copy's array member points back to -- is only ever reached
 * through the `"$ref": "#"` inside the file, which carries no usable name.
 */
export const input = {
  type: 'object',
  additionalProperties: false,
  properties: {
    x: {$ref: 'RecursiveOneOf.json', description: 'annotated'},
  },
}

export const options = {
  cwd: 'test/resources/',
}
