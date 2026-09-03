/**
 * A `$ref` where a schema is expected has to resolve to one (an object or a boolean). This one
 * resolves to a file that is empty, so the compiler says which `$ref`, which file, and what was
 * found there -- rather than crashing in the parser (`Cannot read properties of undefined`).
 */
export const input = {
  title: 'RefToEmptyFile',
  type: 'object',
  properties: {
    y: {$ref: 'test/resources/NotASchema/empty.json'},
  },
  additionalProperties: false,
}

export const error =
  /\$ref "test\/resources\/NotASchema\/empty\.json" at properties\/y resolves to .*NotASchema[\\/]empty\.json, which is not a JSON Schema: the file is empty/
