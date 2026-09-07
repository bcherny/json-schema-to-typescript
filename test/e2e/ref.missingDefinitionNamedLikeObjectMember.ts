// A `$ref` to a definition that does not exist is reported as missing even when its name is a member
// every object inherits (`__proto__`, `constructor`, `toString`): since 16.0.2 the ref parser looks
// only at the document's own keys, so `#/definitions/__proto__` no longer resolves to
// Object.prototype (which compiled to `unknown`)
export const input = {
  title: 'MissingDefinitionNamedLikeObjectMember',
  type: 'object',
  properties: {
    a: {$ref: '#/definitions/__proto__'},
  },
  definitions: {},
  additionalProperties: false,
}

export const error = 'Missing $ref pointer "#/definitions/__proto__"'
