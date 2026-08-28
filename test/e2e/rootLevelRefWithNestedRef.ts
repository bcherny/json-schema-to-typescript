// A root-level `$ref` whose target itself contains a further `$ref`.
// @see https://github.com/bcherny/json-schema-to-typescript/issues/132
export const input = {
  $ref: '#/$defs/Document',
  $defs: {
    Document: {
      type: 'object',
      properties: {
        match: {
          $ref: '#/$defs/Match',
        },
      },
    },
    Match: {
      type: 'object',
    },
  },
}
