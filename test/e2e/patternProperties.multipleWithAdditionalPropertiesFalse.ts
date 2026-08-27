/** @see https://github.com/bcherny/json-schema-to-typescript/issues/315 */
// More than one `patternProperties` entry + `additionalProperties: false`:
// master drops every pattern property and emits `export interface Paths {}`,
// so `PathItem` is declared but never referenced from `Paths`. With a single
// entry the same schema gets `[k: string]: PathItem` (see patternProperties.9.ts
// for the union logic). Reduction from the OpenAPI 3.0 spec schema (`Paths`),
// as posted on the issue; realWorld.openapi.ts and patternProperties.4.ts
// snapshot the same drop as accepted output today.
export const input = {
  title: 'Paths',
  type: 'object',
  patternProperties: {
    '^\\/': {$ref: '#/definitions/PathItem'},
    '^x-': {},
  },
  additionalProperties: false,
  definitions: {
    PathItem: {type: 'object', properties: {get: {type: 'string'}}},
  },
}
