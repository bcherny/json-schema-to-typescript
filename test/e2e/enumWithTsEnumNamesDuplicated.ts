// Two enum members cannot share a name (TS2300 "Duplicate identifier"), so a name listed
// twice in `tsEnumNames` is rejected with a ValidationError, as a `tsEnumNames` of the
// wrong length is, rather than emitted as an enum that does not compile or silently
// renamed. test/validator.test.ts pins the message.
export const input = {
  title: 'EnumWithTsEnumNamesDuplicated',
  type: 'object',
  properties: {
    p: {
      type: 'string',
      enum: ['a', 'b'],
      tsEnumNames: ['Same', 'Same'],
    },
  },
  additionalProperties: false,
}

export const error = true
