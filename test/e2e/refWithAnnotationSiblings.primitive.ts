// @see https://github.com/bcherny/json-schema-to-typescript/issues/334
// A `$ref` with a sibling `description` pointing at a *primitive* definition that
// carries its own `description`: the property should stay a reference to the named
// type (keeping the property-level comment) and the named type should keep its own
// comment, instead of being inlined as `string`.
export const input = {
  title: 'App',
  type: 'object',
  additionalProperties: false,
  properties: {
    version: {
      description: 'A version identifier for your code.',
      $ref: '#/definitions/VersionSchema',
    },
  },
  definitions: {
    VersionSchema: {
      description: 'Represents a simplified semver string.',
      type: 'string',
      pattern: '^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$',
    },
  },
}
