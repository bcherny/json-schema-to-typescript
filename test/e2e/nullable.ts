// https://github.com/bcherny/json-schema-to-typescript/issues/410
// OpenAPI 3.0 `nullable: true` is ignored on every schema shape, not just next to a
// `$ref` (see nullableRef.ts): primitives, objects with and without an explicit `type`
// (the case raised in the #522 review), enums and consts, arrays, `allOf: [{$ref}]`
// (the spec's own way to make a reference nullable) and definitions that are
// themselves nullable should all come out as `X | null`. `null` must be added once,
// even when `enum` or `type` already allow it, and `nullable: false` changes nothing.
// Expected output is hand-written: what master emits for this schema with every
// `nullable: true` spelled out as `anyOf: [<schema>, {type: 'null'}]` (keeping
// `title`, `description` and `deprecated` on the outer schema).
export const input = {
  title: 'Nullable',
  type: 'object',
  definitions: {
    Bar: {type: 'object', properties: {baz: {type: 'boolean'}}},
    NullableObject: {
      description: 'A definition that is itself nullable',
      type: 'object',
      properties: {foo: {type: 'string'}},
      nullable: true,
    },
    NullableString: {type: 'string', nullable: true},
  },
  properties: {
    string: {type: 'string', nullable: true, description: 'Property comments stay on the property'},
    integer: {type: 'integer', nullable: true},
    boolean: {type: 'boolean', nullable: true},
    deprecated: {type: 'string', nullable: true, deprecated: true},
    array: {type: 'array', items: {type: 'string', nullable: true}, nullable: true},
    typedObject: {type: 'object', properties: {a: {type: 'string'}}, additionalProperties: false, nullable: true},
    untypedObject: {properties: {b: {type: 'string'}}, nullable: true},
    enum: {type: 'string', enum: ['a', 'b'], nullable: true},
    enumWithNull: {type: 'string', enum: ['a', 'b', null], nullable: true},
    const: {const: 'x', nullable: true},
    typeArrayWithNull: {type: ['string', 'null'], nullable: true},
    titled: {title: 'NullableNumber', type: 'number', nullable: true},
    allOfRef: {allOf: [{$ref: '#/definitions/Bar'}], nullable: true},
    refToNullableObject: {$ref: '#/definitions/NullableObject'},
    refToNullableString: {$ref: '#/definitions/NullableString'},
    notNullable: {type: 'string', nullable: false},
  },
  required: ['string', 'untypedObject', 'allOfRef'],
  additionalProperties: false,
}
