// https://github.com/bcherny/json-schema-to-typescript/issues/410
// `nullable: true` on a schema that constrains nothing else (alone, next to annotations
// only, or as its own `allOf` member - a spelling some OpenAPI 3.0 generators use) is not
// rewritten to `anyOf: [<schema>, {type: 'null'}]`: such a schema already admits null (and
// anything else), so it is left alone and comes out as `unknown`, comment kept. As an
// `allOf` member it narrows nothing, so the optimizer drops it: `allOfMember?: Bar`.
export const input = {
  title: 'NullableAnnotationOnly',
  type: 'object',
  definitions: {Bar: {type: 'object', properties: {baz: {type: 'boolean'}}}},
  properties: {
    bare: {nullable: true},
    described: {description: 'Anything, or null', nullable: true},
    allOfMember: {allOf: [{$ref: '#/definitions/Bar'}, {nullable: true}]},
  },
  additionalProperties: false,
}
