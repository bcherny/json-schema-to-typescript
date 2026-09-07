/**
 * refToNonSchemaValue.ts, for a pointer that lands on a keyword's list -- an `enum`, a
 * `required` -- rather than on a schema: an array is no more a schema than a string is. (It used
 * to come out as a tuple of the list's members, `y?: ["metres", "feet"]`.)
 */
export const input = {
  title: 'RefToNonSchemaArray',
  type: 'object',
  definitions: {
    unit: {type: 'string', enum: ['metres', 'feet']},
  },
  properties: {
    y: {$ref: '#/definitions/unit/enum'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "#\/definitions\/unit\/enum" at properties\/y resolves to an array of 2 items, which is not a JSON Schema/
