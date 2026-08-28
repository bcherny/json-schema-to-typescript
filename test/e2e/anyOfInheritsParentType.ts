// https://github.com/bcherny/json-schema-to-typescript/issues/528
export const input = {
  type: 'string',
  anyOf: [{format: 'hostname'}, {format: 'ipv6'}],
}
