export const input = {
  title: 'NonIdentifierEnumValues',
  type: 'object',
  properties: {
    // `null` cannot become an enum member: a member's value must be a string or a
    // number, so this has to stay a union rather than emit `null = null`.
    mixedWithNull: {
      type: 'string',
      enum: ['x', null],
    },
    // Legal enum values that are not legal TypeScript identifiers. They can be
    // enum member names, but only when quoted.
    leadingDigit: {
      type: 'string',
      enum: ['0bar', '1baz'],
    },
    emptyString: {
      type: 'string',
      enum: ['', 'x'],
    },
    // Control: ordinary values still produce bare, unquoted member names.
    plain: {
      type: 'string',
      enum: ['alpha', 'beta'],
    },
  },
  required: ['mixedWithNull', 'leadingDigit', 'emptyString', 'plain'],
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
