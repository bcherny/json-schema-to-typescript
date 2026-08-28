// @see https://github.com/bcherny/json-schema-to-typescript/issues/559
export const input = {
  type: 'object',
  patternProperties: {'leaf|tree': {type: 'array'}},
}

export const options = {
  strictIndexSignatures: true,
}
