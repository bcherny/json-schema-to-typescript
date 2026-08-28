/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/410
 * nullableRef.ts, with the `$ref` + `nullable` pair inside a file reached through a `$ref`
 * (test/resources/NullableRef.json) rather than in the document being compiled: `maybe` is
 * `Plain | null` and `Plain` is emitted once, not as a second, nullable `Plain1`.
 */
export const input = {
  title: 'Outer',
  type: 'object',
  properties: {
    w: {$ref: 'NullableRef.json'},
  },
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
