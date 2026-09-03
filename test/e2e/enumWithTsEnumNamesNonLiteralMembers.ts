// A TypeScript enum holds strings and numbers only, so an `enum` with a `null`, boolean,
// object or array value cannot become one: `None = null` does not compile (TS2474 in a
// const enum, TS18033 otherwise). Such an `enum` is typed as it would be without
// `tsEnumNames` -- a union of its values' literal types, named like any other enum --
// rather than rejected: `[null, "x"]` with names is how a nullable enum is often spelt.
export const input = {
  title: 'EnumWithTsEnumNamesNonLiteralMembers',
  type: 'object',
  definitions: {
    level: {
      title: 'Level',
      description: 'null while unset',
      enum: [null, 'low', 'high'],
      tsEnumNames: ['Unset', 'Low', 'High'],
    },
  },
  properties: {
    withNull: {
      enum: [null, 'x'],
      tsEnumNames: ['None', 'X'],
    },
    withBoolean: {
      enum: ['auto', true, false],
      tsEnumNames: ['Auto', 'On', 'Off'],
    },
    withObjectAndArray: {
      enum: [{}, [1], 'a'],
      tsEnumNames: ['Empty', 'One', 'A'],
    },
    // `const` is a one-value `enum` by the time names are applied
    constNull: {
      const: null,
      tsEnumNames: ['Null'],
    },
    level: {
      $ref: '#/definitions/level',
    },
    // Control: strings and numbers, mixed, are what a TypeScript enum is for.
    mixed: {
      enum: ['a', 1, -2.5],
      tsEnumNames: ['A', 'One', 'MinusTwoAndAHalf'],
    },
  },
  required: ['withNull', 'withBoolean', 'withObjectAndArray', 'constNull', 'level', 'mixed'],
  additionalProperties: false,
}
