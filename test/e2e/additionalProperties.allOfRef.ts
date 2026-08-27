// @see https://github.com/bcherny/json-schema-to-typescript/issues/356
// Guard: an object reached through `allOf: [{$ref}]` whose typed
// `additionalProperties` sits next to an optional named property must get an
// index signature the named property is assignable to (no TS2411). Fixed on
// master by #704; this case pins the `allOf` + `$ref` shape from the issue.
export const input = {
  title: 'Test',
  allOf: [{$ref: '#/definitions/FormObject'}],
  definitions: {
    FormObject: {
      properties: {
        message: {type: 'string', maxLength: 4000},
      },
      additionalProperties: {type: 'string', maxLength: 100},
      type: 'object',
    },
  },
}
