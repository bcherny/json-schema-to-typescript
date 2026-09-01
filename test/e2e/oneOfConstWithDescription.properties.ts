/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/475
 * Companion to oneOfConstWithDescription.ts: described `const` members as property
 * types (the ESLint rule-options shape the issue comes from), mixed with undescribed
 * members, and the shapes that render elsewhere or are deliberately left alone.
 */
export const input = {
  title: 'RuleOptions',
  type: 'object',
  additionalProperties: false,
  properties: {
    accessibility: {
      description: 'Every member described',
      oneOf: [
        {const: 'explicit', description: 'Always require an accessor.'},
        {const: 'no-public', description: 'Require an accessor except when public.'},
        {const: 'off', description: 'Never check whether there is an accessor.'},
      ],
    },
    someDescribed: {
      description: 'Undescribed members stay on the same `|` list',
      anyOf: [
        {const: 'a'},
        {const: 'b', description: 'Only (b) has a description.'},
        {const: 'c'},
        {const: 1, description: 'Number and null literals too:\nsecond line of (1).'},
        {const: null, description: 'Nothing.'},
      ],
    },
    deprecatedMember: {
      oneOf: [{const: 'current'}, {const: 'legacy', description: 'Use "current" instead.', deprecated: true}],
    },
    titledMember: {
      description: 'A titled member is declared on its own, with its description there',
      oneOf: [
        {const: 'named', title: 'NamedChoice', description: 'Lives on the NamedChoice declaration.'},
        {const: 'inline', description: 'Stays inline.'},
      ],
    },
    enumMember: {
      description: 'An inline `enum` member is a literal union too',
      anyOf: [
        {enum: ['red', 'green'], description: 'Additive primaries.'},
        {enum: ['cyan', 'magenta'], description: 'Subtractive primaries.'},
      ],
    },
    typedMembers: {
      description: 'Non-literal members (string, number, ...) are left alone, as before',
      oneOf: [
        {type: 'string', description: 'Dropped: not a literal.'},
        {const: 0, description: 'Kept: a literal.'},
      ],
    },
    plainEnum: {
      description: 'A plain enum has no per-member descriptions to keep',
      enum: ['x', 'y'],
    },
  },
}
