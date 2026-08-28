// https://github.com/bcherny/json-schema-to-typescript/issues/395
// A property schema `{allOf: [{$ref}], required: [...]}` loses its sibling
// `required`: typesOfSchema() yields only ALL_OF (UNNAMED_SCHEMA fires on sibling
// `properties`, never on `required`), so `reference` is plain `Defined` and
// `{reference: {foo: 'bar'}}` typechecks although the schema rejects it. Expected
// output is hand-written after the thread (maintainer: "some sort of intersection
// type … preferably without the any") = what master emits when the required member
// is spelled out as `{properties: {subproperty}, required, additionalProperties: false}`.
export const input = {
  title: 'ExampleSchema',
  type: 'object',
  properties: {
    reference: {
      allOf: [{$ref: '#/definitions/Defined'}],
      required: ['subproperty'],
    },
  },
  definitions: {
    Defined: {
      type: 'object',
      properties: {subproperty: {type: 'integer'}},
    },
  },
  additionalProperties: false,
}
