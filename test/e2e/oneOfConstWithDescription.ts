// https://github.com/bcherny/json-schema-to-typescript/issues/475
// The issue's own schema: each `const` member's description used to be dropped,
// leaving a bare `"a" | "b"`.
export const input = {
  title: 'Example',
  oneOf: [
    {const: 'a', description: 'First comment (a).'},
    {const: 'b', description: 'Second comment (b).'},
  ],
}
