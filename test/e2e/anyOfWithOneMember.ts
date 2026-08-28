// A union or intersection with one member is printed as that member, so the optimizer has
// nothing to do there. It used to collapse a one-member `anyOf`/`allOf` around a schema that
// accepts any value to a bare `unknown`, losing the member's name (`Anything`, `Loose` were
// never declared) and the description of the property holding it.
export const input = {
  type: 'object',
  additionalProperties: false,
  definitions: {
    anything: {title: 'Anything', description: 'accepts any value'},
    loose: {title: 'Loose', description: 'one arm, which accepts any value', anyOf: [{}]},
  },
  properties: {
    documented: {description: 'holds anything', anyOf: [{$ref: '#/definitions/anything'}]},
    loose: {$ref: '#/definitions/loose'},
    narrowed: {type: 'string', allOf: [{$ref: '#/definitions/anything'}]},
  },
}
