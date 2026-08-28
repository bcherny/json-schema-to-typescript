// A schema's own `additionalProperties` schema types every key its `properties` do not name,
// whatever an `anyOf`/`oneOf`/`allOf` beside it adds. With `properties` present the parent's
// object type was already intersected with the members; with none, the parent contributed
// nothing and the typed index signature was lost (`dict` was `{id: unknown; [k: string]:
// unknown}`, `tagged` the bare union of its members). `additionalProperties: true` or `{}` says
// nothing the members do not already allow, so `open` stays the plain union.
// The rule is the one `properties`/`patternProperties` already follow — an object keyword gives an
// untyped schema an object type of its own — so it also applies where they already did and a
// typed `additionalProperties` did not: `besideEnum` pins that corner (the object type intersected
// with the enum's members, exactly what `{properties: {…}, enum: […]}` emits today).
export const input = {
  title: 'AdditionalPropertiesBesideAnyOf',
  type: 'object',
  properties: {
    dict: {
      type: 'object',
      additionalProperties: {type: 'string'},
      anyOf: [{required: ['id']}],
    },
    tagged: {
      type: 'object',
      additionalProperties: {type: 'string'},
      oneOf: [
        {properties: {kind: {const: 'a'}}, required: ['kind']},
        {properties: {kind: {const: 'b'}, note: {type: 'string'}}, required: ['kind']},
      ],
    },
    both: {
      type: 'object',
      additionalProperties: {type: 'number'},
      allOf: [{properties: {x: {type: 'number'}}}, {properties: {y: {type: 'number'}}}],
    },
    open: {
      type: 'object',
      additionalProperties: {},
      oneOf: [{properties: {a: {type: 'number'}}}, {properties: {b: {type: 'number'}}}],
    },
    besideEnum: {
      additionalProperties: {type: 'string'},
      enum: [{a: 'x'}, 'none'],
    },
  },
  additionalProperties: false,
}
