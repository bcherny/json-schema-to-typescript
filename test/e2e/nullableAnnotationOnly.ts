// https://github.com/bcherny/json-schema-to-typescript/issues/410
// `nullable: true` on a schema that constrains nothing else (alone, next to annotations
// only, or as its own `allOf` member - a spelling some OpenAPI 3.0 generators use) must
// not turn the schema into `unknown | null`: that folds to `unknown`, swallows the other
// `allOf` members and drops the comment. Such a schema already admits null, so it is left
// alone. The nullable-only `allOf` member carries no recognized keyword, so the parser's
// hasNoRecognizedKeywords / isVacuousInterface rule (PR 743) drops it instead of emitting
// a stray `& {[k: string]: unknown}`: `allOfMember?: Bar`.
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
