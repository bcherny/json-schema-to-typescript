/**
 * refToNonSchemaValue.array.ts, with the pointer leading into another file: the error names the
 * file the list was found in. (It used to come out as `y?: ["firstName", "lastName"]`.)
 */
export const input = {
  title: 'RefToNonSchemaArrayInFile',
  type: 'object',
  properties: {
    y: {$ref: 'test/resources/ReferencedType.json#/required'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "test\/resources\/ReferencedType\.json#\/required" at properties\/y resolves to an array of 2 items in .*ReferencedType\.json, which is not a JSON Schema/
