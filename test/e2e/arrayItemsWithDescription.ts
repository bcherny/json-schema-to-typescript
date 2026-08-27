/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/660
 * The `description` of a non-standalone `items` schema is parsed into the
 * AST but the generator's ARRAY case never emits it, so it is silently
 * dropped. Where it should go is a maintainer decision (see the issue); the
 * snapshot entry for this case encodes one proposal - appended to the array
 * type's own comment - so that the test fails on master showing the missing
 * text. Change that one entry if another placement is chosen.
 */
export const input = {
  title: 'Peoples',
  type: 'array',
  description: 'Peoples desc',
  items: {
    type: 'string',
    description: 'Item desc',
  },
}
