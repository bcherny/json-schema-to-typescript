// https://github.com/bcherny/json-schema-to-typescript/issues/426
// `if`/`then`/`else` are never read (no matcher in typesOfSchema.ts), so the
// allOf member below contributes only a stray `{[k: string]: unknown}` and
// `postal_code` appears nowhere in the output. How conditionals should be
// rendered is a maintainer decision (discriminated-union expansion vs. merging
// `then`/`else` properties as optional); the hand-written snapshot entry pins the
// simplest reading — `postal_code?: string` present — i.e. what master emits when
// the member is written as `{properties: {postal_code: ...}}` directly.
export const input = {
  title: 'Demo',
  type: 'object',
  properties: {country: {enum: ['US', 'CA']}},
  allOf: [
    {
      if: {properties: {country: {const: 'US'}}},
      then: {properties: {postal_code: {type: 'string', pattern: '[0-9]{5}'}}},
    },
  ],
}
