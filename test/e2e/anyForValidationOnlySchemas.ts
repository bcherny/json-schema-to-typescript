// A schema with no keyword that shapes a type -- only bounds on values (`pattern`, `format`,
// `maximum`, `minLength`), annotations (`$comment`, `readOnly`, `examples`), OpenAPI's
// `nullable`, or keys this tool doesn't know (`ignoreCase`, `x-*`) -- says nothing about which
// type a value is, so it is `unknown` like the empty schema, not an object. `description` and
// `title` still make it to the output. A keyword that holds subschemas (`not`, `if`) is a shape
// of its own, implemented or not, and keeps the object fallback.
export const input = {
  title: 'AnyForValidationOnlySchemas',
  type: 'object',
  definitions: {
    identifier: {
      title: 'Identifier',
      description: 'A definition with only a pattern keeps its name, as an alias for unknown',
      pattern: '^[a-z][a-z0-9-]*$',
    },
  },
  properties: {
    name: {pattern: '^a'},
    when: {format: 'date-time'},
    n: {maximum: 3},
    c: {$comment: 'x'},
    r: {readOnly: true},
    s: {minLength: 1},
    e: {examples: ['a', 1]},
    nullable: {nullable: true},
    describedNullable: {description: 'Anything, or null', nullable: true},
    vscodeStyle: {
      description: 'A glob pattern, matched case-insensitively',
      ignoreCase: true,
      pattern: '^[^\\/]+$',
    },
    custom: {'x-foo': 'bar'},
    defaultOnly: {description: 'A `default` that is no string, number or boolean says nothing about the type either', default: null},
    inAllOf: {allOf: [{pattern: 'a'}, {type: 'string'}]},
    viaRef: {$ref: '#/definitions/identifier'},
    unimplementedApplicator: {not: {type: 'null'}},
  },
  additionalProperties: false,
}
