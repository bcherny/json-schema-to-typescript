/**
 * refToNonSchemaDocument.emptyFile.ts, for a pointer into this very document that lands on a
 * keyword's value instead of a schema: the same error, with no file to name. (It used to print
 * the value as the property's type, `y?: "metres"`.)
 */
export const input = {
  title: 'RefToNonSchemaValue',
  type: 'object',
  definitions: {
    unit: {type: 'string', default: 'metres'},
  },
  properties: {
    y: {$ref: '#/definitions/unit/default'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "#\/definitions\/unit\/default" at properties\/y resolves to the string "metres", which is not a JSON Schema/
