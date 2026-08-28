// https://github.com/bcherny/json-schema-to-typescript/issues/419
// The issue's own two-variant schema. PR #716's oneOfWithDescription.ts keeps only
// variant 1, which hides where the comment for members 2..n lands: on #716's head
// prettier attaches it to the end of the previous member (`} /**`). The expected
// snapshot here is #716's build with the comment emitted after a leading newline,
// so each variant's description sits on its own lines above its `| {`.
export const input = {
  title: 'QueryMsg',
  oneOf: [
    {
      description: 'This is variant 1',
      type: 'object',
      required: ['kind'],
      properties: {kind: {type: 'string', enum: ['variant_1']}},
    },
    {
      description: 'This is variant 2',
      type: 'object',
      required: ['kind'],
      properties: {kind: {type: 'string', enum: ['variant_2']}},
    },
  ],
}
