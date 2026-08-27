/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/442
 * `unevaluatedProperties: false` (draft 2019-09+) on a plain object schema with
 * no applicators closes the object exactly like `additionalProperties: false`,
 * but master ignores the keyword and emits `[k: string]: unknown`. The snapshot
 * entry is hand-written to the closed interface, so this fails on master.
 * Community PR #738 (test/e2e/unevaluatedProperties.ts) covers more shapes.
 */
export const input = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  title: 'Foo',
  properties: {
    bar: {
      type: 'string',
    },
  },
  unevaluatedProperties: false,
}
