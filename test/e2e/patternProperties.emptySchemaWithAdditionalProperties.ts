// A catch-all pattern next to a typed `additionalProperties` (the OpenAPI 3.0 `Callback` shape):
// the index signature is `PathItem | unknown`, i.e. `unknown`, and `PathItem` must still be
// declared although nothing else references it.
export const input = {
  title: 'Callback',
  type: 'object',
  patternProperties: {
    '^x-': {},
  },
  additionalProperties: {$ref: '#/definitions/PathItem'},
  definitions: {
    PathItem: {type: 'object', properties: {get: {type: 'string'}}, additionalProperties: false},
  },
}
