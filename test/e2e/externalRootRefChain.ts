/**
 * rootLevelRefToRefOnlyDefinition.ts (issue 740), with that shape in a file reached through a
 * `$ref` (test/resources/RootRefChain.json) rather than in the document being compiled: the
 * file's root is only `$ref: '#/definitions/Hop'`, and `Hop` is only `$ref: '#/definitions/Target'`.
 * `whole` is a `Target`, declared once (this used to throw "Refs should have been resolved").
 */
export const input = {
  title: 'Outer',
  type: 'object',
  properties: {
    whole: {$ref: 'RootRefChain.json'},
  },
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
