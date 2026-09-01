/**
 * externalRootRefChain.ts, pointing into the file instead of at it: a JSON Pointer into a file
 * whose own root is an internal `$ref` used to throw the same way, whatever the pointer led to.
 */
export const input = {
  title: 'Outer',
  type: 'object',
  properties: {
    target: {$ref: 'RootRefChain.json#/definitions/Target'},
  },
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
