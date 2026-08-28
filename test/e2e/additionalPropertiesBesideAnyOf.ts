// A schema's own `additionalProperties` schema types every key its `properties` do not name,
// whatever an `anyOf`/`oneOf`/`allOf` beside it adds. With `properties` present the parent's
// object type was already intersected with the members; with none, the parent contributed
// nothing and the typed index signature was lost (`dict` was `{id: unknown; [k: string]:
// unknown}`, `tagged` the bare union of its members). `additionalProperties: true` or `{}` says
// nothing the members do not already allow, so `open` stays the plain union.
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
  },
  additionalProperties: false,
}
