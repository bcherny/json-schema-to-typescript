// @see https://github.com/bcherny/json-schema-to-typescript/issues/627
// `readonly` composes with `strictIndexSignatures`: the widened index signature stays readonly.
export const input = {
  title: 'ReadonlyStrict',
  type: 'object',
  properties: {
    maybe: {type: 'string'},
  },
  additionalProperties: {type: 'number'},
}

export const options = {
  readonly: true,
  strictIndexSignatures: true,
}
