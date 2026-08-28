// https://github.com/bcherny/json-schema-to-typescript/issues/528
// An inherited `array` type is normalized like a declared one (`maxItems` without
// `minItems` still yields the empty tuple).
export const input = {
  type: 'array',
  oneOf: [{minItems: 2}, {maxItems: 1}],
}
