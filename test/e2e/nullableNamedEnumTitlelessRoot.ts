// https://github.com/bcherny/json-schema-to-typescript/issues/410
// Pins today's output for a nullable TypeScript enum that is the root schema and has no
// title: `export type <Name> = (...) | null`, a literal union without an `enum`
// declaration (master, ignoring `nullable`, emitted `export const enum <Name>`). With a
// title it stays `export type <Name> = Title | null` + `export const enum Title` (see
// nullableNamedEnum.ts).
export const input = {
  type: 'string',
  enum: ['active', 'gone'],
  nullable: true,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
