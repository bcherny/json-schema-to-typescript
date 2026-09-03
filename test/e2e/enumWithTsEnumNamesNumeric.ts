// `tsEnumNames` that TypeScript would read as numbers (`"1"`, `"-1"`, `"2.5"`) cannot
// be enum member names, quoted or not (TS2452). Like every other name a schema
// supplies, they are made legal rather than rejected: a leading underscore is enough.
// Names that merely contain digits or signs (`"+1"`, `"3rd"`) are left alone.
export const input = {
  title: 'EnumWithNumericTsEnumNames',
  type: 'object',
  properties: {
    level: {
      type: 'integer',
      enum: [1, -1, 25, 100, 3],
      tsEnumNames: ['1', '-1', '2.5', '+1', '3rd'],
    },
  },
  required: ['level'],
  additionalProperties: false,
}
