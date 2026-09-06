// Object keywords (`properties`, `patternProperties`) say nothing about a value whose `type`
// is not `object`, so they are ignored there -- on a schema that carries an `$id` (every root,
// and every definition reached through a `$ref`) just as on one that does not. Before, `label`
// was `{a?: string; [k: string]: unknown} & string`, which no string satisfies, and `tagged`
// was `{[k: string]: string} & unknown[]`, with a comment naming its owner as `undefined`.
export const input = {
  type: 'object',
  properties: {
    label: {$ref: '#/definitions/label'},
    tagged: {$ref: '#/definitions/tagged'},
    inline: {type: 'number', properties: {a: {type: 'string'}}},
  },
  definitions: {
    label: {type: 'string', properties: {a: {type: 'string'}}},
    tagged: {type: 'array', patternProperties: {'^x-': {type: 'string'}}},
  },
}
