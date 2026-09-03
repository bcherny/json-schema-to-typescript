// A TypeScript enum member cannot have a numeric name (TS2452), quoted or not:
// `"1" = "1"` and `"-1" = "-1"` do not compile. TypeScript calls a name numeric when
// parsing it as a number and printing that number gives the same text back, so
// `"+1"`, `"01"`, `"1e3"` and `"Infinity"` are fine as they are. A value that would
// be a numeric name gets a leading underscore; every other value is used verbatim.
export const input = {
  title: 'NumericStringEnumValues',
  type: 'object',
  properties: {
    // github/rest-api-description, components/schemas/reaction/properties/content:
    // the real-world schema this was first seen on
    reaction: {
      type: 'string',
      enum: ['+1', '-1', 'laugh', 'confused', 'heart', 'hooray', 'rocket', 'eyes'],
    },
    digits: {
      type: 'string',
      enum: ['1', '2'],
    },
    // Only the names TypeScript rejects are touched: `1.5` is numeric, the rest
    // merely look like numbers and stay as they are (quoted where necessary).
    numberish: {
      type: 'string',
      enum: ['1.5', '-0', '01', '1e3', '0x1', '.5', 'Infinity', 'NaN'],
    },
    // The prefixed name must not collide with another value that is used verbatim.
    collision: {
      type: 'string',
      enum: ['1', '_1', '__1'],
    },
    // A repeated value would be a repeated member (TS2300); it is emitted once.
    repeated: {
      type: 'string',
      enum: ['a', 'a', 'b'],
    },
  },
  required: ['reaction', 'digits', 'numberish', 'collision', 'repeated'],
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
