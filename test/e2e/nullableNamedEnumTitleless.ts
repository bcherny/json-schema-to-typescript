// https://github.com/bcherny/json-schema-to-typescript/issues/410
// Pins today's output for nullable TypeScript enums (`tsEnumNames`, or inferred with
// `inferStringEnumKeysFromValues`) that have no title and sit where the normalizer has no
// property or definition name to give them: `items`, `additionalProperties` and a numeric
// property key. They print as a literal union `| null`, without an `enum` declaration
// (master, ignoring `nullable`, declared `KeyNameFromDefinitionItems`, `KString` and
// `NoName`). See nullableNamedEnumTitlelessRoot.ts for the root schema, and
// nullableNamedEnum.ts for the positions that do keep their declaration.
export const input = {
  title: 'NullableNamedEnumTitleless',
  type: 'object',
  properties: {
    roles: {
      type: 'array',
      items: {type: 'string', enum: ['admin', 'user'], nullable: true},
    },
    200: {type: 'string', enum: ['a', 'b'], tsEnumNames: ['A', 'B'], nullable: true},
  },
  additionalProperties: {type: 'string', enum: ['x', 'y'], nullable: true},
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
